import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useAccount, useChainId, useWriteContract, useReadContract, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { formatUnits } from 'viem';
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

// Helper function to pick random unique items from an array
const pickRandom = (arr, count) => {
    if (!arr || arr.length === 0) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
};

export default function Blumenwiese() {
    const { t } = useTranslation();
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const { data: writeContractResult, writeContract } = useWriteContract();
    const { connect } = useConnect();
    const { config } = useContext(ConfigContext);

    const [gruesse, setGruesse] = useState(50);
    const [komplizen, setKomplizen] = useState(0);
    const [functionName, setFunctionName] = useState('blumenErnten');

    useEffect(() => {
        if (komplizen > 0) {
            setFunctionName(gruesse > 0 ? 'halloBluemel' : 'halloWelt');
        } else {
            setFunctionName('blumenErnten');
        }
    }, [gruesse, komplizen]);

    const functionInfo = useMemo(() => 
        CONTRACT_MAPPINGS.wiese.functions.find(f => f.name === functionName),
        [functionName]
    );

    const pamphletAddress = CONTRACT_MAPPINGS.pamphlet[chainId];
    const { data: zaehler, refetch } = useReadContract({
        address: pamphletAddress,
        abi: [{ name: 'zaehler', type: 'function', stateMutability: 'view', outputs: [ { name: 'v', type: 'uint32' }, { name: 'w', type: 'uint32' }, { name: 'f', type: 'uint32' }, { name: 't', type: 'uint80' }, { name: 'lw', type: 'uint32' }, { name: 'lg', type: 'uint32' }, { name: 'x', type: 'uint16' } ] }],
        functionName: 'zaehler',
        query: { enabled: !!pamphletAddress, refetchInterval: 5000 }
    });

    const handleInteract = () => {
        if (!isConnected) {
            connect({ connector: injected() });
            return;
        }

        if (!functionInfo) {
            console.error('Wiese function details not found for action:', functionName);
            alert('Contract function details not found. See console for details.');
            return;
        }

        let args = [];
        if (functionName === 'halloBluemel') {
            args = [pickRandom(KOMPLIZEN, komplizen), parseInt(gruesse, 10)];
        } else if (functionName === 'halloWelt') {
            args = [pickRandom(KOMPLIZEN, komplizen)];
        } else { // blumenErnten
            args = [parseInt(gruesse, 10)];
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
            if (functionName === 'halloBluemel') {
                const args = [KOMPLIZEN.slice(0, komplizen), parseInt(gruesse, 10)];
                const bluemelAmount = functionInfo.info.calc(args, zaehler);
                return `${komplizen} Komplizen, ${bluemelAmount} Bluemel`;
            } else if (functionName === 'halloWelt') {
                return `${komplizen} Komplizen`;
            } else { // blumenErnten
                const bluemelAmount = gruesse * 100;
                return `${bluemelAmount} Bluemel`;
            }
        } catch (error) {
            console.error("Error calculating expected output:", error, functionName);
            return "Error calculating output";
        }
    };

    const renderGruesseIcons = () => {
        const icons = [];
        const count = Math.min(gruesse, 100);
        const baseRadius = 120;

        for (let i = 0; i < count; i++) {
            const radius = baseRadius * (1 + (Math.random() - 0.5) * 0.1);
            const direction = Math.random() < 0.5 ? 1 : -1;
            const duration = 30;
            const startOffset = i / count;
            const delay = -startOffset * duration;

            const animationDirection = direction === 1 ? 'normal' : 'reverse';
            
            const armStyle = {
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 0,
                height: 0,
                animation: `orbit ${duration}s linear ${delay}s infinite`,
                animationDirection: animationDirection,
            };

            const offsetterStyle = {
                transform: `translateX(${radius}px)`,
            };

            const iconHolderStyle = {
                animation: `counter-orbit ${duration}s linear ${delay}s infinite`,
                animationDirection: animationDirection,
            };

            icons.push(
                <div key={`g-${i}`} style={armStyle}>
                    <div style={offsetterStyle}>
                        <div style={iconHolderStyle}>
                            <div style={{ transform: 'translate(-50%, -50%)' }}>
                                <BluemelIcon />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return icons;
    };

    const renderKomplizenIcons = () => {
        const icons = [];
        const count = Math.min(komplizen, 100);
        const baseRadius = 150;

        for (let i = 0; i < count; i++) {
            const radius = baseRadius * (1 + (Math.random() - 0.5) * 0.1);
            const direction = Math.random() < 0.5 ? 1 : -1;
            const duration = 30 * (1 + (Math.random() - 0.5) * 0.4);
            const startOffset = i / count;
            const delay = -startOffset * duration;

            const animationDirection = direction === 1 ? 'normal' : 'reverse';
            
            const armStyle = {
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 0,
                height: 0,
                animation: `orbit ${duration}s linear ${delay}s infinite`,
                animationDirection: animationDirection,
            };

            const offsetterStyle = {
                transform: `translateX(${radius}px)`,
            };

            const iconHolderStyle = {
                animation: `counter-orbit ${duration}s linear ${delay}s infinite`,
                animationDirection: animationDirection,
            };

            icons.push(
                <div key={`k-${i}`} style={armStyle}>
                    <div style={offsetterStyle}>
                        <div style={iconHolderStyle}>
                            <div style={{ transform: 'translate(-50%, -50%)' }}>
                                <SmallBluemelIcon />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return icons;
    };

    return (
        <div style={styles.container} className={`theme-${config.theme}`}>
            <style>
                {`
                    @keyframes pulsate {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }
                    @keyframes orbit {
                        from { transform: rotate(0deg); }
                        to   { transform: rotate(360deg); }
                    }
                    @keyframes counter-orbit {
                        from { transform: rotate(0deg); }
                        to   { transform: rotate(-360deg); }
                    }
                `}
            </style>
            <h2 style={styles.title}>{getExpectedOutput()}</h2>
            <div style={styles.centerpiece}>
                <img src="/android-chrome-512x512.png" alt="Blümel" style={styles.mainBluemel} />
                {renderGruesseIcons()}
                {renderKomplizenIcons()}
            </div>
            <button onClick={handleInteract} style={styles.button}>
                {isConnected ? t(functionName) : t('Connect')}
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
    mainBluemel: {
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        animation: 'pulsate 1.5s ease-in-out infinite',
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
};