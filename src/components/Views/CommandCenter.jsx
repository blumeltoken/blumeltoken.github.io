import React, { useState, useEffect, useContext } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain, useWriteContract, useFeeData } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { parseUnits, formatUnits } from 'viem';
import { ConfigContext } from '../../App';
import { CONTRACT_MAPPINGS } from '../../core/mappings';

import FunctionInfo from './CommandCenter/FunctionInfo';
//import FineTuning from './CommandCenter/FineTuning';
import BoxWrapper from './CommandCenter/BoxWrapper';

export default function CommandCenter() {
  const { configText, setConfigText } = useContext(ConfigContext);
  const config = JSON.parse(configText);
  
  const { address, isConnected } = useAccount();
  const { disconnect, connect } = { ...useDisconnect(), ...useConnect() };
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();
  const { writeContract } = useWriteContract();
  const { data: feeData, refetch: refreshNet } = useFeeData({ watch: true });

  const [customNonce, setCustomNonce] = useState('');
  const [priorityFee, setPriorityFee] = useState('');
  const [gasLimit, setGasLimit] = useState('');
  const [activeTab, setActiveTab] = useState('claim');
  const [activeFunctions, setActiveFunctions] = useState([]);
  const [inputs, setInputs] = useState({});
  const [abiText, setAbiText] = useState('');
  const [targetAddress, setTargetAddress] = useState('');

  useEffect(() => {
    if (chainId && !config.advancedMode) {
      loadPreselected(activeTab);
    }
  }, [chainId, config.advancedMode, activeTab]);

  const updateGlobalConfig = (k, v) => setConfigText(JSON.stringify({ ...config, [k]: v }, null, 2));

  const loadPreselected = (key) => {
    setActiveTab(key);
    const map = CONTRACT_MAPPINGS[key];
    if (!map) return setActiveFunctions([]);

    const functions = (map.functions || []).map(f => ({
      ...f,
      target: f.targets ? f.targets[chainId] : (map[chainId] || ''),
      tokenAddress: CONTRACT_MAPPINGS.token[chainId],
      isView: f.abi?.stateMutability === 'view'
    }));
    
    setActiveFunctions(functions);
    const initialInputs = {};
    functions.forEach(f => { if (f.defaultInputs) initialInputs[f.name] = f.defaultInputs; });
    setInputs(initialInputs);
  };

  const handleInputChange = (fName, idx, val) => {
    setInputs(prev => ({ ...prev, [fName]: { ...prev[fName], [idx]: val } }));
  };

  const txOptions = {
    nonce: customNonce ? Number(customNonce) : undefined,
    gas: gasLimit ? BigInt(gasLimit.split('.')[0].split(',')[0]): undefined,
    maxPriorityFeePerGas: priorityFee ? parseUnits(priorityFee.replace(',', '.'), 9) : undefined
  };

  return (
    <div style={containerStyle}>
      <BoxWrapper title="Settings">
        <div style={{ display: 'flex', gap: '5px' }}>
          <select value={config.theme} onChange={(e) => updateGlobalConfig('theme', e.target.value)} style={dropdownStyle}>
            {['matrix', 'dracula', 'solarized'].map(t => <option key={t} value={t}>THEME: {t.toUpperCase()}</option>)}
          </select>
          <button onClick={() => updateGlobalConfig('advancedMode', !config.advancedMode)} style={btnStyle}>
            ADVANCED: {config.advancedMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </BoxWrapper>

      <BoxWrapper title="Links">
        <div style={{ fontSize: '10px' }}>
          - <a href="https://discord.gg/C4UJjv58ya" target="_blank" style={linkStyle}>DISCORD_SRV https://discord.gg/C4UJjv58ya</a><br/>
          - <a href="legacy/" target="_blank" style={linkStyle}>blümel.finance legacy version</a>
        </div>
      </BoxWrapper>

      <BoxWrapper title="Wallet">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: '#fff' }}>{isConnected ? `${address.slice(0,6)}...${address.slice(-4)}` : '[ DISCONNECTED ]'}</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <select onChange={(e) => switchChain({ chainId: Number(e.target.value) })} value={chainId} style={dropdownStyle}>
              {chains.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
            </select>
            <button onClick={() => isConnected ? disconnect() : connect({ connector: injected() })} style={btnStyle}>
              {isConnected ? 'DISCONNECT' : 'CONNECT'}
            </button>
          </div>
        </div>
      </BoxWrapper>

      {config.advancedMode ? (
        <BoxWrapper title="ABI_Input">
          <textarea value={abiText} onChange={e => setAbiText(e.target.value)} style={areaStyle} placeholder="PASTE_ABI_JSON" />
          <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
            <input value={targetAddress} onChange={e => setTargetAddress(e.target.value)} style={{ ...areaStyle, height: '22px', marginTop: 0, flexGrow: 1 }} placeholder="0x..." />
            <button onClick={() => {
              try {
                const parsed = JSON.parse(abiText);
                setActiveFunctions(parsed.filter(f => f.type === 'function').map(a => ({ 
                  name: a.name, abi: a, target: targetAddress, isView: a.stateMutability === 'view'
                })));
              } catch(e) { alert("Invalid ABI"); }
            }} style={btnStyle}>PARSE</button>
          </div>
        </BoxWrapper>
      ) : (
        <BoxWrapper title="Preset_Actions">
          <select onChange={(e) => loadPreselected(e.target.value)} value={activeTab} style={{ ...dropdownStyle, width: '100%' }}>
            <option value="claim">CLAIM_GAS_AND_GREET</option>
            <option value="faucet">FAUCET_REQUEST</option>
            <option value="community">BUILD_COMMUNITY</option>
          </select>
        </BoxWrapper>
      )}

      <div style={{ padding: '0 5px' }}>
        {activeFunctions.map((f, i) => (
          <div key={i} style={funcRowStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--fg)', fontWeight: 'bold' }}>{f.name.toUpperCase()}</span>
              {/* Build Community/Multi-param logic: display inputs below, single-param logic: inline */}
              {f.abi?.inputs?.length === 1 && (
                <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input style={{ ...paramInputStyle, borderBottom: '1px solid #444' }} value={inputs[f.name]?.[0] || ''} onChange={(e) => handleInputChange(f.name, 0, e.target.value)} />
                </div>
              )}
              <button onClick={() => writeContract({ 
                address: f.target, abi: [f.abi], functionName: f.abi.name, 
                args: Object.values(inputs[f.name] || {}), ...txOptions 
              })} style={btnStyle}>RUN</button>
            </div>
            
            <FunctionInfo fObj={f} userAddress={address} />

            {/* Restored Parameters for BUILD_COMMUNITY (Multi-input) */}
            {f.abi?.inputs?.length > 1 && f.abi.inputs.map((input, idx) => (
              <div key={idx} style={{ display: 'flex', marginTop: '4px', alignItems: 'center' }}>
                <span style={{ color: '#555', fontSize: '9px', width: '85px' }}>{input.name}:</span>
                <input 
                  style={paramInputStyle} 
                  value={inputs[f.name]?.[idx] || ''} 
                  onChange={(e) => handleInputChange(f.name, idx, e.target.value)} 
                  placeholder={input.type} 
                />
              </div>
            ))}
          </div>
        ))}
      </div>

	  {/*
      <FineTuning 
        nonce={customNonce} setNonce={setCustomNonce}
        priority={priorityFee} setPriority={setPriorityFee}
        gas={gasLimit} setGas={setGasLimit}
        feeData={feeData} refresh={() => refreshNet()}
        btnStyle={btnStyle} inputStyle={paramInputStyle}
        chainId={chainId}
      />
      */}
    </div>
  );
}

const containerStyle = { padding: '10px', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'monospace', height: '100%', overflowY: 'auto' };
const btnStyle = { background: 'transparent', color: 'var(--fg)', border: '1px solid var(--fg)', fontSize: '9px', cursor: 'pointer', padding: '2px 6px' };
const dropdownStyle = { background: '#000', color: 'var(--fg)', border: '1px solid var(--border)', fontSize: '9px', outline: 'none' };
const funcRowStyle = { borderBottom: '1px solid #111', padding: '12px 0' };
const areaStyle = { width: '100%', background: '#000', color: '#0f0', border: '1px solid var(--border)', fontSize: '10px', marginTop: '5px', outline: 'none', resize: 'none', fontFamily: 'monospace' };
const paramInputStyle = { background: 'transparent', border: 'none', borderBottom: '1px solid #222', color: '#fff', fontSize: '10px', outline: 'none' };
const linkStyle = { color: 'var(--fg)', textDecoration: 'none' };
