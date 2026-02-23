import React, { useState, useEffect, useContext } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain, useWriteContract, useReadContract } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { ConfigContext } from '../../App';
import { CONTRACT_MAPPINGS } from '../../core/mappings';

export default function CommandCenter() {
  const { configText, setConfigText } = useContext(ConfigContext);
  const config = JSON.parse(configText);
  
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();
  const { writeContract } = useWriteContract();

  const [abiText, setAbiText] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [activeFunctions, setActiveFunctions] = useState([]); 
  const [inputs, setInputs] = useState({});

  // Trigger initial load on mount or chain change
  useEffect(() => {
    if (chainId && !config.advancedMode) {
      loadPreselected('claim');
    }
  }, [chainId]);

  const updateGlobalConfig = (key, val) => {
    const newConfig = { ...config, [key]: val };
    setConfigText(JSON.stringify(newConfig, null, 2));
  };

  const loadPreselected = (key) => {
    if (!key) {
      setActiveFunctions([]);
      setAbiText('');
      setTargetAddress('');
      setInputs({});
      return;
    }

    const map = CONTRACT_MAPPINGS[key];
    if (!map) return;

    const normalizedFunctions = (map.functions || map.abi.map(a => ({ 
      abi: a, 
      targets: map.mainAddress 
    }))).map(f => ({
      name: f.name || f.abi.name,
      abi: f.abi || f,
      target: (f.targets ? f.targets[chainId] : map.mainAddress[chainId]) || '',
      isView: (f.abi?.stateMutability || f.stateMutability) === 'view',
      defaultInputs: f.defaultInputs || {}
    }));
    
    setActiveFunctions(normalizedFunctions);
    
    const initialInputs = {};
    normalizedFunctions.forEach(f => {
      if (f.defaultInputs) initialInputs[f.name] = f.defaultInputs;
    });
    setInputs(initialInputs);

    if (window.term) window.term.writeln(`\x1b[32m[SYS] Loaded ${map.name}\x1b[0m`);
  };

  const handleInputChange = (fName, idx, val) => {
    setInputs(prev => ({
      ...prev,
      [fName]: { ...prev[fName], [idx]: val }
    }));
  };

  return (
    <div style={containerStyle}>
      {/* SETTINGS SECTION */}
      <div style={boxStyle}>
        <div>[ SETTINGS ]</div>
        <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
          <select value={config.theme} onChange={(e) => updateGlobalConfig('theme', e.target.value)} style={dropdownStyle}>
            <option value="matrix">THEME: MATRIX</option>
            <option value="dracula">THEME: DRACULA</option>
            <option value="solarized">THEME: SOLARIZED</option>
          </select>
          <button onClick={() => updateGlobalConfig('advancedMode', !config.advancedMode)} style={btnStyle}>
            ADVANCED: {config.advancedMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* LINKS SECTION */}
      <div style={boxStyle}>
        [ LINKS ] 
        <br/>- <a href="https://discord.gg/C4UJjv58ya" target="_blank" style={linkStyle}>DISCORD_SRV https://discord.gg/C4UJjv58ya</a>
        <br/>- <a href="legacy/" target="_blank" style={linkStyle}>blümel.finance legacy version</a>
      </div>

      {/* WALLET SECTION */}
      <div style={boxStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#fff' }}>{isConnected ? `${address.slice(0,6)}...${address.slice(-4)}` : '[ DISCONNECTED ]'}</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <select onChange={(e) => switchChain({ chainId: Number(e.target.value) })} value={chainId} style={dropdownStyle}>
              {chains.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
            </select>
            <button onClick={() => isConnected ? disconnect() : connect({ connector: injected() })} style={btnStyle}>
              {isConnected ? 'DISCONNECT' : 'CONNECT'}
            </button>
          </div>
        </div>
      </div>

      {/* PRESET SECTION - Moved below address box */}
      {!config.advancedMode && (
        <div style={boxStyle}>
          <div>[ PRESET_ACTIONS ]</div>
          <select 
            onChange={(e) => loadPreselected(e.target.value)} 
            defaultValue="claim"
            style={{ ...dropdownStyle, width: '100%', marginTop: '5px' }}
          >
            <option value="">-- RESET_INTERFACE --</option>
            <option value="claim">CLAIM_GAS_AND_GREET</option>
            <option value="faucet">FAUCET_REQUEST</option>
            <option value="community">BUILD_COMMUNITY</option>
          </select>
        </div>
      )}

      {/* ADVANCED ABI INPUT */}
      {config.advancedMode && (
        <div style={boxStyle}>
          <div>[ ABI_INPUT ]</div>
          <textarea value={abiText} onChange={e => setAbiText(e.target.value)} style={areaStyle} placeholder="PASTE_ABI_JSON" />
          <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
            <input value={targetAddress} onChange={e => setTargetAddress(e.target.value)} style={{ ...areaStyle, height: '20px', marginTop: 0, flexGrow: 1 }} placeholder="0x..." />
            <button onClick={() => {
              try {
                const parsed = JSON.parse(abiText);
                setActiveFunctions(parsed.filter(f => f.type === 'function').map(a => ({ 
                  name: a.name, abi: a, target: targetAddress, isView: a.stateMutability === 'view'
                })));
              } catch(e) { alert("Invalid ABI JSON"); }
            }} style={btnStyle}>PARSE</button>
          </div>
        </div>
      )}

      {/* DYNAMIC FUNCTION LIST */}
      <div style={{ marginTop: '10px' }}>
        {activeFunctions.map((fObj, i) => (
          <FunctionRow 
            key={fObj.name + i} 
            fObj={fObj} 
            currentInputs={inputs[fObj.name] || {}} 
            onInputChange={(idx, val) => handleInputChange(fObj.name, idx, val)}
            writeContract={writeContract}
            advancedMode={config.advancedMode}
          />
        ))}
      </div>
    </div>
  );
}

function FunctionRow({ fObj, currentInputs, onInputChange, writeContract, advancedMode }) {
  const argsArray = Object.values(currentInputs);
  const { data: viewData, refetch } = useReadContract({
    address: fObj.target,
    abi: [fObj.abi],
    functionName: fObj.abi.name,
    args: argsArray,
    query: { enabled: fObj.isView && fObj.target.startsWith('0x') }
  });

  return (
    <div style={{ borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ color: 'var(--fg)', fontWeight: 'bold' }}>{fObj.name.toUpperCase()}</span>
          {advancedMode && <div style={{ fontSize: '8px', color: '#555' }}>TARGET: {fObj.target.slice(0,12)}...</div>}
        </div>
        {fObj.isView ? (
          <button onClick={() => refetch()} style={btnStyle}>REFRESH_STATE</button>
        ) : (
          <button onClick={() => writeContract({ 
            address: fObj.target, abi: [fObj.abi], functionName: fObj.abi.name, args: argsArray 
          })} style={btnStyle}>RUN</button>
        )}
      </div>

      {fObj.abi.inputs?.map((input, idx) => (
        <div key={idx} style={{ display: 'flex', marginTop: '4px', alignItems: 'center' }}>
          <span style={{ color: '#555', fontSize: '9px', width: '85px' }}>{input.name || `arg${idx}`}:</span>
          <input 
            style={paramInputStyle} 
            value={currentInputs[idx] || ''}
            onChange={(e) => onInputChange(idx, e.target.value)} 
            placeholder={input.type}
          />
        </div>
      ))}

      {fObj.isView && viewData !== undefined && (
        <div style={{ marginTop: '5px', padding: '4px', background: '#0a0a0a', color: '#0f0', fontSize: '10px', borderLeft: '2px solid var(--fg)' }}>
          STATE_OUT: {viewData.toString()}
        </div>
      )}
    </div>
  );
}

const containerStyle = { padding: '10px', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'monospace', fontSize: '11px', height: '100%', overflowY: 'auto' };
const boxStyle = { border: '1px solid var(--border)', padding: '8px', marginBottom: '10px' };
const btnStyle = { background: 'transparent', color: 'var(--fg)', border: '1px solid var(--fg)', cursor: 'pointer', fontSize: '9px', padding: '1px 4px', fontFamily: 'monospace' };
const dropdownStyle = { background: '#000', color: 'var(--fg)', border: '1px solid var(--fg)', fontSize: '9px', fontFamily: 'monospace', outline: 'none' };
const areaStyle = { width: '100%', background: '#000', color: '#0f0', border: '1px solid var(--border)', fontSize: '10px', marginTop: '5px', fontFamily: 'monospace', outline: 'none' };
const paramInputStyle = { background: 'transparent', border: 'none', borderBottom: '1px solid #222', color: '#fff', fontSize: '10px', flexGrow: 1, outline: 'none', fontFamily: 'monospace' };
const linkStyle = { color: 'var(--fg)', textDecoration: 'none' };
