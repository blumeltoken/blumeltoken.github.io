import { CONFIG, ABIS } from './config.js';

const ethers = window.ethers;

let signer, provider;
window.currentChainId = null;
window.CONFIG = CONFIG;

export async function init() {
    if (!window.ethereum) return window.log("ERR: NO_WALLET_DETECTED");

    try {
        // 1. Setup Provider
        provider = new ethers.BrowserProvider(window.ethereum);
        
        // 2. Immediate Network Check
        const network = await provider.getNetwork();
        window.currentChainId = Number(network.chainId);
        
        const netName = CONFIG[window.currentChainId] ? CONFIG[window.currentChainId].name : "UNKNOWN_NET";
        document.getElementById('netDisplay').innerText = `NODE: ${netName}`;

        // 3. Request Accounts & Await Signer
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        
        window.log(`SYS: AUTH_GRANTED_${await signer.getAddress()}`);
        
        // Listen for network changes
        window.ethereum.on('chainChanged', () => window.location.reload());
        
        refreshBalances();
    } catch (e) {
        window.log(`ERR: INIT_FAILED - ${e.message}`);
    }
}

async function refreshBalances() {
    if (!CONFIG[window.currentChainId]) return;
    try {
        const tokenAddr = CONFIG[window.currentChainId].TOKEN;
        const target = CONFIG[window.currentChainId].BLUMELITY;
        const token = new ethers.Contract(tokenAddr, ABIS.TOKEN, provider);
        const bVal = await token.balanceOf(target);
        document.getElementById('tokenBal').innerText = `STASH: ${ethers.formatUnits(bVal, 18)} BLUMEL`;
    } catch (e) { console.error("Balance scan failed", e); }
}

window.exec = async (contractKey, fn, ...args) => {
    try {
        // RE-VALIDATE SIGNER
        if (!signer) {
            window.log("WAIT: CONNECTING_SIGNER...");
            signer = await provider.getSigner();
        }
        
        const addr = CONFIG[window.currentChainId][contractKey];
        // THE FIX: Ensure contract is connected to SIGNER, not provider
        const contract = new ethers.Contract(addr, ABIS[contractKey], signer);
        
        window.log(`EXEC: ${contractKey}.${fn}`);
        
        // Handle array inputs for spreadJoy (splitting CSV string)
        const processedArgs = args.map(arg => 
            (typeof arg === 'string' && arg.includes(',')) ? arg.split(',').map(s => s.trim()) : arg
        );

        const tx = await contract[fn](...processedArgs);
        window.log(`PENDING: ${tx.hash}`);
        await tx.wait();
        window.log("STATUS: SUCCESSFUL");
        refreshBalances();
    } catch (e) { 
        window.log(`ERR: ${e.reason || e.message}`); 
    }
};

window.onload = init;
