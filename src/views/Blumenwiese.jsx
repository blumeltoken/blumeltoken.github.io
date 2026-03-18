import React, { useState, useEffect, useContext } from 'react';
import { useAccount, useChainId, useWriteContract, useReadContract, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { getAddress, formatUnits } from 'viem';
import { ConfigContext } from '../App';
import { CONTRACT_MAPPINGS } from '../core/mappings';
import { KOMPLIZEN } from '../core/komplizen';
import { useTranslation } from 'react-i18next';

const SmallBluemelIcon = () => (
    <img src="/favicon-32x32.png" alt="Small Bluemel" style={{ width: 16, height: 16, borderRadius: '50%' }} />
);

const BluemelIcon = () => (
    <img src="/apple-touch-icon.png" alt="Blümel" style={{ width: 24, height: 24, borderRadius: '50%' }} />
);

export default function Blumenwiese() {
    const { t } = useTranslation();
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { data: writeContractResult, writeContract } = useWriteContract();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const { chains, switchChain } = useSwitchChain();
    const { config } = useContext(ConfigContext);

    const [gruesse, setGruesse] = useState(50);
    const [komplizen, setKomplizen] = useState(0);
    
    const [blumelFunctionKey, setBlumelFunctionKey] = useState('blumenErnten');
    const [blumelFunctionName, setBlumelFunctionName] = useState('claim');

    useEffect(() => {
        if (komplizen > 0) {
            if (gruesse > 0) {
                setBlumelFunctionKey('halloBlumel');
                setBlumelFunctionName('claimWithGruesse');
            } else {
                setBlumelFunctionKey('halloWelt');
                setBlumelFunctionName('claimWithKomplizen');
            }
        } else {
            setBlumelFunctionKey('blumenErnten');
            setBlumelFunctionName('claim');
        }
    }, [gruesse, komplizen]);

    const pamphletAddress = CONTRACT_MAPPINGS.pamphlet[chainId];
    const { data: zaehler, refetch } = useReadContract({
        address: pamphletAddress,
        abi: [{ name: 'zaehler', type: 'function', stateMutability: 'view', outputs: [ { name: 'v', type: 'uint32' }, { name: 'w', type: 'uint32' }, { name: 'f', type: 'uint32' }, { name: 't', type: 'uint80' }, { name: 'lw', type: 'uint32' }, { name: 'lg', type: 'uint32' }, { name: 'x', type: 'uint16' } ] }],
        functionName: 'zaehler',
        query: { enabled: !!pamphletAddress, refetchInterval: 5000 }
    });
    
    useEffect(() => {
        refetch();
    }, [chainId, refetch]);

    const functionInfo = CONTRACT_MAPPINGS.claim.functions.find(f => f.name === blumelFunctionName);

    const handleInteract = () => {
        if (!isConnected) {
            connect({ connector: injected() });
            return;
        }

        if (!functionInfo) {
            console.error('Contract function details not found for the current action:', blumelFunctionName);
            console.log('Available functions:', CONTRACT_MAPPINGS.claim.functions.map(f => f.name));
            alert('Contract function details not found for the current action. See console for details.');
            return;
        }

        let args = [];
        if (blumelFunctionName === 'claimWithGruesse') {
            args = [gruesse, KOMPLIZEN.slice(0, komplizen)];
        } else if (blumelFunctionName === 'claimWithKomplizen') {
            args = [KOMPLIZEN.slice(0, komplizen)];
        } else { // claim
            args = [gruesse];
        }

        try {
            writeContract({
                address: functionInfo.targets[chainId],
                abi: [functionInfo.abi],
                functionName: functionInfo.abi.name,
                args: args
            });
        } catch (error) {
            console.error('Error sending transaction:', error);
            alert(`Error sending transaction: ${error.message}`);
        }
    };

    const getExpectedOutput = () => {
        if (!functionInfo || !zaehler) return "Loading...";

        try {
            if (blumelFunctionName === 'claimWithGruesse') {
                const bluemelAmount = functionInfo.info.calc([BigInt(gruesse), KOMPLIZEN.slice(0, komplizen)], zaehler);
                return `${komplizen} Komplizen, ${formatUnits(bluemelAmount, 18)} Bluemel`;
            } else if (blumelFunctionName === 'claimWithKomplizen') {
                return `${komplizen} Komplizen`;
            } else { // claim
                return `${formatUnits(BigInt(gruesse) * BigInt(100), 18)} Bluemel`;
            }
        } catch (error) {
            console.error("Error calculating expected output:", error);
            return "Error calculating output";
        }
    };
    
    const renderGruesseIcons = () => {
        const icons = [];
        const count = Math.min(gruesse, 100);
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * 2 * Math.PI;
            const x = 180 + 140 * Math.cos(angle);
            const y = 180 + 140 * Math.sin(angle);
            icons.push(<div key={`g-${i}`} style={{...styles.attachedIcon, top: y, left: x, animation: 'rotate-clockwise 30s linear infinite'}}><BluemelIcon /></div>);
        }
        return icons;
    };

    const renderKomplizenIcons = () => {
        const icons = [];
        const count = Math.min(komplizen, 100);
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * 2 * Math.PI;
            const x = 180 + 170 * Math.cos(angle);
            const y = 180 + 170 * Math.sin(angle);
            icons.push(<div key={`k-${i}`} style={{...styles.attachedIcon, top: y, left: x, animation: 'rotate-counter-clockwise 30s linear infinite'}}><SmallBluemelIcon /></div>);
        }
        return icons;
    };

    return (
        <div style={styles.container} className={`theme-${config.theme}`}>
            <h2 style={styles.title}>{getExpectedOutput()}</h2>
            <div style={styles.centerpiece}>
                <img src="/android-chrome-512x512.png" alt="Blümel" style={styles.mainBlumel} />
                {renderGruesseIcons()}
                {renderKomplizenIcons()}
            </div>
            <button onClick={handleInteract} style={styles.button}>
                {isConnected ? t(blumelFunctionKey) : t('Connect')}
            </button>

            <div style={styles.sliders}>
                <div style={styles.sliderContainer}>
                    <label>Grüße: {gruesse}</label>
                    <input type="range" min="0" max="200" value={gruesse} onChange={(e) => setGruesse(e.target.value)} />
                </div>
                <div style={styles.sliderContainer}>
                    <label>Komplizen: {komplizen}</label>
                    <input type="range" min="0" max={KOMPLIZEN.length} value={komplizen} onChange={(e) => setKomplizen(e.target.value)} />
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'var(--bg)',
        color: 'var(--fg)',
        textAlign: 'center',
        padding: '20px 0',
    },
    title: {
        fontSize: '1.5em',
        fontWeight: 'bold',
        minHeight: '1.5em',
        color: 'var(--fg)',
        marginBottom: '20px',
    },
    centerpiece: {
        position: 'relative',
        width: '360px',
        height: '360px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    mainBlumel: {
        width: '200px',
        height: '200px',
        transition: 'transform 0.2s',
        borderRadius: '50%',
    },
    button: {
        padding: '12px 24px',
        fontSize: '1.2em',
        cursor: 'pointer',
        background: 'var(--bg-alt)',
        color: 'var(--fg)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease-in-out',
        fontWeight: 'bold',
    },
    sliders: {
        display: 'flex',
        gap: '30px',
        marginTop: '30px',
    },
    sliderContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
    },
    attachedIcon: {
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
    },
    '@keyframes rotate-clockwise': {
        from: { transform: 'translate(-50%, -50%) rotate(0deg)' },
        to: { transform: 'translate(-50%, -50%) rotate(360deg)' },
    },
    '@keyframes rotate-counter-clockwise': {
        from: { transform: 'translate(-50%, -50%) rotate(0deg)' },
        to: { transform: 'translate(-50%, -50%) rotate(-360deg)' },
    },
};