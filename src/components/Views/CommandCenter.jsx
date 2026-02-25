import React, { useState, useEffect, useContext } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain, useWriteContract } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { isAddress, getAddress } from 'viem'; // Checksum utilities
import { ConfigContext } from '../../App';
import { CONTRACT_MAPPINGS, BLOCK_EXPLORERS } from '../../core/mappings';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

import FunctionInfo from './CommandCenter/FunctionInfo';
import BoxWrapper from './CommandCenter/BoxWrapper';

export default function CommandCenter() {
  const { configText, setConfigText } = useContext(ConfigContext);
  const config = JSON.parse(configText);
  const { t } = useTranslation();
  
  const { address, isConnected } = useAccount();
  const { disconnect, connect } = { ...useDisconnect(), ...useConnect() };
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();
  const { writeContract } = useWriteContract();

  const [activeTab, setActiveTab] = useState('claim');
  const [activeFunctions, setActiveFunctions] = useState([]);
  const [inputs, setInputs] = useState({});
  const [abiText, setAbiText] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const mainnets = chains.filter(c => !c.testnet);
  const testnets = chains.filter(c => c.testnet);

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

  // --- VALIDATION & CHECKSUM LOGIC ---
  const validateAndParse = (type, val) => {
    const raw = (val || "").toString().trim();
    
    // 1. Handle Arrays (address[] or uint256[])
    if (type.includes('[]')) {
      if (raw === "") return { ok: true, data: [], count: 0 };
      
      const arrayData = raw.replace(/[\[\]\"\'']/g, '')
                             .split(',')
                             .map(s => s.trim())
                             .filter(s => s !== '');
      
      const isAddrArray = type.includes('address');
      
      // isAddress() checks both format and checksum if applicable
      const isValid = arrayData.every(item => 
        isAddrArray ? isAddress(item) : /^(0x[a-fA-F0-9]+|[0-9]+)$/.test(item)
      );

      // Convert to checksummed versions if valid
      const processedData = isValid && isAddrArray ? arrayData.map(a => getAddress(a)) : arrayData;
      
      return { 
        ok: isValid, 
        data: processedData, 
        count: arrayData.length,
        err: !isValid ? (isAddrArray ? "CHECKSUM_ERR" : "NUM_ERR") : null 
      };
    }

    if (raw === "") return { ok: false, data: null };

    // 2. Handle Single uint
    if (type.includes('uint')) {
      const isHex = raw.startsWith('0x');
      const isValid = isHex ? /^0x[a-fA-F0-9]+$/.test(raw) : /^[0-9]+$/.test(raw);
      return { ok: isValid, data: raw, err: !isValid ? "NOT_UINT" : null };
    }

    // 3. Handle Single Address
    if (type === 'address') {
      const isValid = isAddress(raw);
      return { ok: isValid, data: isValid ? getAddress(raw) : raw, err: !isValid ? "CHECKSUM_ERR" : null };
    }

    return { ok: true, data: raw };
  };

  const isRowValid = (f) => {
    const fInputs = f.abi?.inputs || [];
    return fInputs.every((input, idx) => validateAndParse(input.type, inputs[f.name]?.[idx]).ok);
  };

  const prepareArgs = (f) => {
    return (f.abi?.inputs || []).map((input, idx) => validateAndParse(input.type, inputs[f.name]?.[idx]).data);
  };

  const blockExplorerUrl = BLOCK_EXPLORERS[chainId];
  const tokenAddress = CONTRACT_MAPPINGS.token[chainId];

  return (
    <div style={containerStyle}>
      <BoxWrapper title="Settings">
        <div style={{ display: 'flex', gap: '5px' }}>
          <select value={config.theme} onChange={(e) => updateGlobalConfig('theme', e.target.value)} style={dropdownStyle}>
            {['matrix', 'dracula', 'solarized'].map(t => <option key={t} value={t}>THEME: {t.toUpperCase()}</option>)}
          </select>
          <select onChange={(e) => i18n.changeLanguage(e.target.value)} value={i18n.language.split('-')[0]} style={dropdownStyle}>
            <option value="en">LANG: EN</option>
            <option value="de">LANG: DE</option>
          </select>
          <button onClick={() => updateGlobalConfig('advancedMode', !config.advancedMode)} style={btnStyle}>
            {t('Advanced')}: {config.advancedMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </BoxWrapper>

      <BoxWrapper title="Links">
        <div style={{ fontSize: '10px' }}>
          - <a href="https://discord.gg/C4UJjv58ya" target="_blank" style={linkStyle}>https://discord.gg/C4UJjv58ya (DISCORD_SRV)</a><br/>
          - <a href="https://blumeltoken.github.io/legacy/" target="_blank" style={linkStyle}>https://blumeltoken.github.io/legacy/ (blümel.finance legacy version)</a><br/>
	        {blockExplorerUrl && tokenAddress && (
	          <span>- <a href={`${blockExplorerUrl}/address/${tokenAddress}`} target="_blank" style={linkStyle}>{`${blockExplorerUrl}/address/${tokenAddress}`}(TOKEN)</a><br/></span>
	        )}
        </div>
      </BoxWrapper>

      <BoxWrapper title="Wallet">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: '#fff' }}>{isConnected ? `${address.slice(0,6)}...${address.slice(-4)}` : '[ DISCONNECTED ]'}</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <select onChange={(e) => switchChain({ chainId: Number(e.target.value) })} value={chainId} style={dropdownStyle}>
              <optgroup label="PRODUCTION">
                {mainnets.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
              </optgroup>
              <optgroup label="────────────────" disabled />
              <optgroup label="TEST_NETWORKS">
                {testnets.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
              </optgroup>
            </select>
            <button onClick={() => isConnected ? disconnect() : connect({ connector: injected() })} style={btnStyle}>
              {isConnected ? 'DISCONNECT' : 'CONNECT'}
            </button>
          </div>
        </div>
      </BoxWrapper>

      {!config.advancedMode ? (
        <BoxWrapper title="Preset_Actions">
          <select onChange={(e) => loadPreselected(e.target.value)} value={activeTab} style={{ ...dropdownStyle, width: '100%' }}>
            <option value="claim">CLAIM_GAS_AND_GREET</option>
            <option value="faucet">FAUCET_REQUEST</option>
            <option value="community">BUILD_COMMUNITY</option>
          </select>
        </BoxWrapper>
      ) : (
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
      )}

      <div style={{ padding: '0 5px' }}>
        {activeFunctions.map((f, i) => {
          const rowValid = isRowValid(f);
          return (
            <div key={`${f.name}-${i}-${chainId}`} style={funcRowStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ flexGrow: 1, paddingTop: '4px' }}>
                  <span style={{ color: 'var(--fg)', fontWeight: 'bold' }}>{f.name.toUpperCase()}</span>
                  {f.target && f.target.startsWith('0x') && (
                    <div style={{ fontSize: '9px', color: '#888', marginTop: '4px', wordBreak: 'break-all' }}>
                      <a href={`${blockExplorerUrl}/address/${f.target}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                        {f.target}
                      </a>
                      {f.abi.name && <span style={{ marginLeft: '8px' }}>({f.abi.name})</span>}
                    </div>
                  )}
                </div>
                
                {f.abi?.inputs?.length === 1 && (
                  <div style={{ flexShrink: 0, width: '120px', position: 'relative' }}>
                    <input 
                      style={{ ...paramInputStyle, borderBottom: rowValid ? '1px solid #444' : '1px solid #f00', width: '100%' }} 
                      value={inputs[f.name]?.[0] || ''} 
                      onChange={(e) => handleInputChange(f.name, 0, e.target.value)} 
                    />
                    {!rowValid && inputs[f.name]?.[0] && <span style={errorTextStyle}>{validateAndParse(f.abi.inputs[0].type, inputs[f.name][0]).err}</span>}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button 
                    disabled={!rowValid}
                    onClick={() => writeContract({ address: f.target, abi: [f.abi], functionName: f.abi.name, args: prepareArgs(f) })} 
                    style={{...btnStyle, opacity: rowValid ? 1 : 0.4}}
                  >RUN</button>
                  {f.info && <button onClick={() => setRefreshTrigger(prev => prev + 1)} style={refreshBtnStyle}>REFRESH</button>}
                </div>
              </div>
              
              <FunctionInfo fObj={f} userAddress={address} refreshTrigger={refreshTrigger} />

              {f.abi?.inputs?.length > 1 && f.abi.inputs.map((input, idx) => {
                const check = validateAndParse(input.type, inputs[f.name]?.[idx]);
                const hasInput = inputs[f.name]?.[idx] !== undefined && inputs[f.name]?.[idx] !== "";
                return (
                  <div key={idx} style={{ display: 'flex', marginTop: '8px', alignItems: 'center', position: 'relative' }}>
                    <span style={{ color: '#555', fontSize: '9px', width: '95px' }}>
                      {input.name}{check.count !== undefined ? ` [${check.count}]` : ''}:
                    </span>
                    <input 
                      style={{...paramInputStyle, borderBottom: (!hasInput || check.ok) ? '1px solid #222' : '1px solid #f00'}} 
                      value={inputs[f.name]?.[idx] || ''} 
                      onChange={(e) => handleInputChange(f.name, idx, e.target.value)} 
                      placeholder={input.type} 
                    />
                    {!check.ok && hasInput && <span style={errorTextStyle}>{check.err}</span>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const containerStyle = { padding: '10px', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'monospace', height: '100%', overflowY: 'auto' };
const btnStyle = { background: 'transparent', color: 'var(--fg)', border: '1px solid var(--fg)', fontSize: '9px', cursor: 'pointer', padding: '2px 6px', outline: 'none' };
const refreshBtnStyle = { ...btnStyle, borderColor: '#333', color: '#666' };
const dropdownStyle = { background: '#000', color: 'var(--fg)', border: '1px solid var(--border)', fontSize: '9px', outline: 'none' };
const funcRowStyle = { borderBottom: '1px solid #111', padding: '12px 0' };
const areaStyle = { width: '100%', background: '#000', color: '#0f0', border: '1px solid var(--border)', fontSize: '10px', marginTop: '5px', outline: 'none', resize: 'none', fontFamily: 'monospace' };
const paramInputStyle = { background: 'transparent', border: 'none', borderBottom: '1px solid #222', color: '#fff', fontSize: '10px', outline: 'none' };
const linkStyle = { color: 'var(--fg)', textDecoration: 'none' };
const errorTextStyle = { position: 'absolute', right: 0, bottom: '-10px', color: '#f00', fontSize: '7px', fontWeight: 'bold' };
