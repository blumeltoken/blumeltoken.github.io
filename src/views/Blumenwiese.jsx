import React, { useState, useEffect, useMemo, useContext, useDeferredValue } from 'react'; 
import { useAccount, useChainId, useWriteContract, useReadContract, useConnect } from 'wagmi'; 
import { injected } from 'wagmi/connectors';
import { formatUnits } from 'viem';
import { ConfigContext } from '../App';
import { CONTRACT_MAPPINGS } from '../core/mappings';
import { KOMPLIZEN } from '../core/komplizen';
import { useTranslation } from 'react-i18next';

const SmallBluemelIcon = () => (
  <img src="/favicon-32x32.png" alt="Small Bluemel" decoding="async" style={{ width: 16, height: 16, borderRadius: '50%', display: 'block' }} /> 
);

const BluemelIcon = () => (
  <img src="/apple-touch-icon.png" alt="Blümel" decoding="async" style={{ width: 24, height: 24, borderRadius: '50%', display: 'block' }} /> 
);

const pickRandom = (arr, count) => {
  if (!arr || arr.length === 0) return [];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

const generateConfigs = (count, minRx, maxRx, maxRy, minDuration, maxDuration) => {
  const configs = [];
  const actualCount = Math.max(count, 0); 
  
  for (let i = 0; i < actualCount; i++) {
    const rx = minRx + Math.random() * (maxRx - minRx);
    const idealRy = rx * (0.3 + Math.random() * 0.5); 
    const ry = Math.min(idealRy, maxRy); 
    const tilt = (Math.random() - 0.5) * 60; 
    const duration = minDuration + Math.random() * (maxDuration - minDuration);
    const delay = -Math.random() * duration; 
    
    configs.push({ rx, ry, tilt, duration, delay });
  }
  return configs;
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
  
  const [isPerformanceMode, setIsPerformanceMode] = useState(true);
  const [compressionRatio, setCompressionRatio] = useState(1);

  const deferredGruesse = useDeferredValue(gruesse);
  const deferredKomplizen = useDeferredValue(komplizen);

  const [initialWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1000);

  const MAX_GRUESSE = 200; 
  const MAX_KOMPLIZEN = KOMPLIZEN?.length || 100;

  const masterGruesseConfigs = useMemo(() => {
    const maxRx = Math.max(130, Math.min(initialWidth * 0.3, 200));
    return generateConfigs(MAX_GRUESSE, 90, maxRx, 110, 20, 45);
  }, [initialWidth]);

  const masterKomplizenConfigs = useMemo(() => {
    const maxRx = Math.max(170, Math.min(initialWidth * 0.45, 300));
    return generateConfigs(MAX_KOMPLIZEN, 130, maxRx, 150, 25, 50);
  }, [initialWidth]);

  useEffect(() => {
    if (!isPerformanceMode) {
      setCompressionRatio(1);
      return;
    }

    let animationFrameId;
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = (currentTime) => {
      frameCount++;
      const delta = currentTime - lastTime;
      
      if (delta >= 1000) { 
        const fps = (frameCount * 1000) / delta;
        if (fps < 45) {
          setCompressionRatio(prev => Math.min(prev + 1, 10));
        } else if (fps > 58 && compressionRatio > 1) {
          if (Math.random() < 0.2) {
             setCompressionRatio(prev => Math.max(prev - 1, 1));
          }
        }
        frameCount = 0;
        lastTime = currentTime;
      }
      animationFrameId = requestAnimationFrame(measureFPS);
    };
    
    animationFrameId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(animationFrameId);
  }, [compressionRatio, isPerformanceMode]);

  const visibleGruesse = Math.ceil(deferredGruesse / compressionRatio);
  const visibleKomplizen = Math.ceil(deferredKomplizen / compressionRatio);

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
    } else { 
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
      } else { 
        const bluemelAmount = gruesse * 100;
        return `${bluemelAmount} Bluemel`;
      }
    } catch (error) {
      console.error("Error calculating expected output:", error, functionName);
      return "Error calculating output";
    }
  };

  const renderOrbitIcons = (configs, IconComponent) => {
    return configs.map((config, i) => {
      const planeStyle = {
        position: 'absolute', top: '50%', left: '50%', width: 0, height: 0,
        transform: `rotate(${config.tilt}deg)`,
        animation: `zIndexSort ${config.duration}s linear ${config.delay}s infinite`,
      };

      const pathStyle = {
        position: 'absolute', top: 0, left: 0, width: 0, height: 0,
        offsetPath: `path('M 0,${-config.ry} A ${config.rx},${config.ry} 0 1,1 0,${config.ry} A ${config.rx},${config.ry} 0 1,1 0,${-config.ry}')`,
        offsetRotate: '0deg', 
        animation: `move-along-path ${config.duration}s linear ${config.delay}s infinite`,
        willChange: 'offset-distance', 
      };

      const scalerStyle = {
         position: 'absolute',
         animation: `depthScale ${config.duration}s linear ${config.delay}s infinite`,
      }

      const iconWrapperStyle = {
        transform: `translate(-50%, -50%) rotate(${-config.tilt}deg)`,
        position: 'absolute',
        willChange: 'transform', 
      };

      return (
        <div key={i} style={planeStyle}>
          <div style={pathStyle}>
            <div style={scalerStyle}>
                <div style={iconWrapperStyle}>
                  <IconComponent />
                </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div style={styles.container} className={`theme-${config.theme} custom-scrollbar`}>
      <style>
        {`
          /* Theme-aware scrollbar styling */
          .custom-scrollbar {
            scrollbar-color: var(--border) var(--bg); /* Firefox */
            scrollbar-width: thin;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: var(--bg);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: var(--border);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: var(--fg);
          }

          /* Animations */
          @keyframes pulsate {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.02); }
            100% { transform: translate(-50%, -50%) scale(1); }
          }
          @keyframes move-along-path {
            0%   { offset-distance: 0%;   animation-timing-function: ease-out; } 
            25%  { offset-distance: 25%;  animation-timing-function: ease-in;  } 
            50%  { offset-distance: 50%;  animation-timing-function: ease-out; } 
            75%  { offset-distance: 75%;  animation-timing-function: ease-in;  } 
            100% { offset-distance: 100%; }
          }
          @keyframes zIndexSort {
            0%, 24.99% { z-index: 2; }    
            25%, 74.99% { z-index: 10; }  
            75%, 100% { z-index: 2; }     
          }
          @keyframes depthScale {
            0%, 100% { transform: scale(0.65); }
            50%      { transform: scale(1.3); }
          }
          .clickable-bluemel {
            cursor: pointer;
            transition: filter 0.2s ease, transform 0.1s ease;
          }
          .clickable-bluemel:hover {
            filter: brightness(1.15) drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
          }
          .clickable-bluemel:active {
            transform: translate(-50%, -50%) scale(0.92) !important; 
            filter: brightness(0.9);
            transition: transform 0.05s linear;
          }
        `}
      </style>
      <h2 style={styles.title}>{getExpectedOutput()}</h2>
      
      {/* Strict fixed-height container that allows infinite horizontal stretch but clips spillover */}
      <div style={styles.overflowTrap}>
        <img 
            src="/android-chrome-512x512.png" 
            alt="Blümel" 
            decoding="async"
            style={styles.mainBluemel} 
            className="clickable-bluemel"
            onClick={handleInteract}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleInteract();
              }
            }}
        />
        {renderOrbitIcons(masterGruesseConfigs.slice(0, visibleGruesse), BluemelIcon)} 
        {renderOrbitIcons(masterKomplizenConfigs.slice(0, visibleKomplizen), SmallBluemelIcon)} 
      </div>
      
      <div style={styles.perfToggleContainer}>
        <input 
          type="checkbox" 
          id="perfToggle" 
          checked={isPerformanceMode} 
          onChange={(e) => setIsPerformanceMode(e.target.checked)} 
          style={{ cursor: 'pointer' }}
        />
        <label htmlFor="perfToggle" style={{ cursor: 'pointer' }}>
          Auto Performance Mode
        </label>
        {isPerformanceMode && compressionRatio > 1 && (
          <span style={{ marginLeft: '4px' }}>
            (1 icon = {compressionRatio} items)
          </span>
        )}
      </div>

      <button onClick={handleInteract} style={styles.button}>
        {isConnected ? t(functionName) : t('Connect')}
      </button>

      <div style={styles.sliders}>
        <div style={styles.sliderContainer}>
          <label>Grüße: {gruesse}</label>
          <input 
            type="range" 
            min="0" 
            max="200" 
            value={gruesse} 
            onChange={(e) => setGruesse(parseInt(e.target.value, 10) || 0)} 
          /> 
        </div>
        <div style={styles.sliderContainer}>
          <label>Komplizen: {komplizen}</label>
          <input 
            type="range" 
            min="0" 
            max={KOMPLIZEN.length} 
            value={komplizen} 
            onChange={(e) => setKomplizen(parseInt(e.target.value, 10) || 0)} 
          /> 
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
        justifyContent: 'center', /* Vertically centers the content in the empty space */
        background: 'var(--bg)',
        color: 'var(--fg)',
        textAlign: 'center',
        padding: '20px 0',
        width: '100%',
        flexGrow: 1, /* Tells it to expand and grab all the empty space the parent offers */
        minHeight: '92vh', /* A safe fallback that ensures it always commands most of the screen */
        boxSizing: 'border-box',
        overflowY: 'auto',
        },
  title: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    minHeight: '1.5em',
    color: 'var(--fg)',
    marginBottom: '10px',
  },
  overflowTrap: {
    position: 'relative',
    width: '100%',
    maxWidth: '100vw',
    height: '340px',
    overflow: 'hidden', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
    flexShrink: 0, 
  },
  perfToggleContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.8em',
    color: 'var(--fg)',
    opacity: 0.6,
    marginTop: '-10px',
    marginBottom: '15px',
    gap: '4px',
  },
  mainBluemel: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(1)',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    zIndex: 5, 
    animation: 'pulsate 2s ease-in-out infinite',
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