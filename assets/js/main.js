import { CONFIG, ABIS } from './config.js';

let signer, provider;
window.currentChainId = null;
window.CONFIG = CONFIG;

export async function init() {
    const logElement = document.getElementById('log');
    const log = (m) => {
        logElement.innerHTML += `\n> ${m}`;
        logElement.scrollTop = logElement.scrollHeight;
    };
    window.log = log;

    if (!window.ethereum) return log("ERR: NO_WALLET_DETECTED");

    try {
        // Initialize Provider
        provider = new ethers.BrowserProvider(window.ethereum);
        
        // Listen for network changes
        window.ethereum.on('chainChanged', () => window.location.reload());
        
        const network = await provider.getNetwork();
        window.currentChainId = Number(network.chainId);
        
        const netName = CONFIG[window.currentChainId] ? CONFIG[window.currentChainId].name : "UNKNOWN_NET";
        document.getElementById('netDisplay').innerText = `NODE: ${netName}`;

        // IMPORTANT: Await the signer to enable transactions
        signer = await provider.getSigner();
        
        log(`SYS: AUTH_GRANTED_${await signer.getAddress()}`);
        refreshBalances();
    } catch (e) {
        log(`ERR: INIT_FAILED - ${e.message}`);
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
        if (!signer) signer = await provider.getSigner();
        
        const addr = CONFIG[window.currentChainId][contractKey];
        const contract = new ethers.Contract(addr, ABIS[contractKey], signer);
        
        window.log(`EXEC: ${contractKey}.${fn}`);
        
        // Correctly handle array conversion for spreadJoy
        const processedArgs = args.map(arg => 
            (typeof arg === 'string' && arg.includes(',')) ? arg.split(',') : arg
        );

        const tx = await contract[fn](...processedArgs);
        window.log(`PENDING: ${tx.hash}`);
        await tx.wait();
        window.log("STATUS: CONFIRMED_OK");
        refreshBalances();
    } catch (e) { 
        window.log(`ERR: ${e.reason || e.message}`); 
    }
};

window.onload = init;
