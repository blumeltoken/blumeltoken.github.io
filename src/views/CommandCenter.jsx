import React, { useState, useEffect, useContext, useCallback, memo } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain, useWriteContract, useBalance, useReadContract } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { isAddress, getAddress, formatUnits } from 'viem';
import { ConfigContext } from '../App';
import { CONTRACT_MAPPINGS, BLOCK_EXPLORERS } from '../core/mappings';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import BoxWrapper from './CommandCenter/BoxWrapper';
import AddressDisplay from '../components/AddressDisplay';

const FunctionRow = memo(({ f, i, zaehler, inputs, handleInputChange, isRowValid, prepareArgs, writeContract, t, blockExplorerUrl, handlePresetClick, address, validateAndParse }) => {
  const { cooldown = 0, divisor = 1n, type, calc, presets, read, noFormat } = f.info || {};
  const isFaucet = type === 'faucet';
  const isLegacy = type === 'legacy';

  const { data: lastClaimTime } = useReadContract({
    address: f.target,
    abi: [{ name: read, type: 'function', stateMutability: 'view', inputs: [{type: 'address'}], outputs: [{type: 'uint256'}] }],
    functionName: read,
    args: [address],
    query: {
      enabled: isFaucet && cooldown > 0 && !!address && f.target?.startsWith('0x'),
      refetchInterval: 5000,
    }
  });

  const { data: alreadyReceived } = useReadContract({
    address: f.target,
    abi: [{ name: 'alreadyReceived', type: 'function', stateMutability: 'view', inputs: [{type: 'address'}], outputs: [{type: 'bool'}] }],
    functionName: 'alreadyReceived',
    args: [address],
    query: {
      enabled: isLegacy && !!address && f.target?.startsWith('0x'),
      refetchInterval: 5000,
    }
  });

  const { data: bal } = useBalance({
    address: f.target,
    token: f.tokenAddress,
    query: { 
      enabled: isFaucet && !!f.target && f.target?.startsWith('0x') && !!f.tokenAddress, 
      refetchInterval: 5000 
    }
  });

  const getStatus = () => {
    if (isLegacy && alreadyReceived) {
      return { isWaiting: true, text: t('Already_Received') };
    }
    if (isFaucet && cooldown > 0 && lastClaimTime) {
      const remaining = Number(lastClaimTime) + cooldown - Math.floor(Date.now() / 1000);
      if (remaining > 0) {
        const h = Math.floor(remaining / 3600);
        const m = Math.floor((remaining % 3600) / 60);
        return { isWaiting: true, text: `${h}h ${m}m` };
      }
    }
    return { isWaiting: false, text: null };
  };

  const status = getStatus();
  const rowIsValid = isRowValid(f);
  const expected_output = calc && rowIsValid ? calc(prepareArgs(f), zaehler) : null;

  return (
    <div style={funcRowStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{ flexGrow: 1, paddingTop: '4px' }}>
          <span style={{ color: 'var(--fg)', fontWeight: 'bold' }}>{f.name.toUpperCase()}</span>
          {isLegacy && alreadyReceived && <span style={{ color: 'var(--fg)', fontSize: '9px', marginLeft: '8px' }}>({t('Claimed')})</span>}
          {f.target && f.target.startsWith('0x') && (
            <div style={{ fontSize: '9px', color: '#888', marginTop: '4px', wordBreak: 'break-all' }}>
              <AddressDisplay address={f.target} blockExplorerUrl={blockExplorerUrl} />
              {f.abi.name && <span style={{ marginLeft: '8px' }}>({f.abi.name})</span>}
            </div>
          )}
        </div>

        {f.abi?.inputs?.length === 1 && f.abi.inputs[0].type.includes('uint') && (() => {
          const validation = validateAndParse(f.abi.inputs[0].type, inputs[f.name]?.[0]);
          return (
            <div style={{ flexShrink: 0, width: '120px', position: 'relative' }}>
              <input 
                style={{ ...paramInputStyle, borderBottom: validation.ok ? '1px solid var(--border)' : '1px solid #f00', width: '100%' }} 
                value={inputs[f.name]?.[0] || ''} 
                onChange={(e) => handleInputChange(f.name, 0, e.target.value)} 
              />
              {!validation.ok && inputs[f.name]?.[0] && <span style={errorTextStyle}>{validation.err}</span>}
            </div>
          );
        })()}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button 
            disabled={!f.target || !rowIsValid || status.isWaiting}
            onClick={() => writeContract({ address: f.target, abi: [f.abi], functionName: f.abi.name, args: prepareArgs(f) })} 
            style={{...btnStyle, opacity: (f.target && rowIsValid && !status.isWaiting) ? 1 : 0.4}}
          >
            {status.isWaiting ? status.text : t('Run')}
          </button>
        </div>
      </div>

      <div style={{ fontSize: '9px', color: 'var(--fg)', marginTop: '4px', opacity: 0.8 }}>
          {isFaucet && bal && divisor > 0n && (
              <span>DRIP_EST: {formatUnits(bal.value / divisor, 18)} blumel</span>
          )}
          {expected_output !== null && (
            <span>
              {t('expected_output')}: {
                noFormat
                  ? `${expected_output.toString()} blumel`
                  : `${formatUnits(expected_output, 18)} blumel`
              }
            </span>
          )}
          {status.isWaiting && !isLegacy && (
              <span> | STATUS: {status.text}</span>
          )}
      </div>

      {(presets || f.info?.presets) && (
          <div style={{ display: 'flex', gap: '5px', marginTop: '8px' }}>
              {Object.keys(presets || f.info.presets).map(p => (
                <button key={p} onClick={() => handlePresetClick(f.name, (presets || f.info.presets)[p])} style={btnStyle}>{p.toUpperCase()}</button>
              ))}
          </div>
      )}

      {(f.abi?.inputs?.length > 1 || (f.abi?.inputs?.length === 1 && !f.abi.inputs[0].type.includes('uint'))) && f.abi.inputs.map((input, idx) => {
          const check = validateAndParse(input.type, inputs[f.name]?.[idx]);
          const hasInput = inputs[f.name]?.[idx] !== undefined && inputs[f.name]?.[idx] !== "";
          return (
              <div key={idx} style={{ display: 'flex', marginTop: '8px', alignItems: 'center', position: 'relative' }}>
                  <span style={{ color: '#555', fontSize: '9px', width: '95px' }}>
                      {input.name}{check.count !== undefined ? ` [${check.count}]` : ''}:
                  </span>
                  <input 
                      style={{...paramInputStyle, borderBottom: (!hasInput || check.ok) ? '1px solid var(--border)' : '1px solid #f00'}}
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
});

export default function CommandCenter() {
  const { config, setConfig } = useContext(ConfigContext);
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

  const mainnets = chains.filter(c => !c.testnet);
  const testnets = chains.filter(c => c.testnet);

  const pamphletAddress = CONTRACT_MAPPINGS.pamphlet[chainId];
  const { data: zaehler } = useReadContract({
    address: pamphletAddress,
    abi: [{ name: 'zaehler', type: 'function', stateMutability: 'view', outputs: [ { name: 'v', type: 'uint32' }, { name: 'w', type: 'uint32' }, { name: 'f', type: 'uint32' }, { name: 't', type: 'uint80' }, { name: 'lw', type: 'uint32' }, { name: 'lg', type: 'uint32' }, { name: 'x', type: 'uint16' } ] }],
    functionName: 'zaehler',
    query: { enabled: !!pamphletAddress, refetchInterval: 5000 }
  });

  const handleInputChange = useCallback((fName, idx, val) => {
    setInputs(prev => ({ ...prev, [fName]: { ...prev[fName], [idx]: val } }));
  }, []);

  const handlePresetClick = useCallback((fName, preset) => {
    const newInputs = preset(zaehler);
    setInputs(prev => ({ ...prev, [fName]: { ...prev[fName], ...newInputs } }));
  }, [zaehler]);

  const validateAndParse = useCallback((type, val) => {
    const raw = (val || "").toString().trim();
    if (type.includes('[]')) {
      if (raw === "") return { ok: true, data: [], count: 0 };
      const arrayData = raw.replace(/[\[\]\"\'\']/g, '').split(',').map(s => s.trim()).filter(s => s !== '');
      const isAddrArray = type.includes('address');
      const isValid = arrayData.every(item => isAddrArray ? isAddress(item) : /^(0x[a-fA-F0-9]+|[0-9]+)$/.test(item));
      const processedData = isValid && isAddrArray ? arrayData.map(a => getAddress(a)) : arrayData;
      return { ok: isValid, data: processedData, count: arrayData.length, err: !isValid ? (isAddrArray ? t("CHECKSUM_ERR") : t("NUM_ERR")) : null };
    }
    if (raw === "") return { ok: false, data: null };
    if (type.includes('uint')) {
      const isHex = raw.startsWith('0x');
      const isValid = isHex ? /^0x[a-fA-F0-9]+$/.test(raw) : /^[0-9]+$/.test(raw);
      return { ok: isValid, data: raw, err: !isValid ? t("NOT_UINT") : null };
    }
    if (type === 'address') {
      const isValid = isAddress(raw);
      return { ok: isValid, data: isValid ? getAddress(raw) : raw, err: !isValid ? t("CHECKSUM_ERR") : null };
    }
    return { ok: true, data: raw };
  }, [t]);

  const isRowValid = useCallback((f) => {
    const fInputs = f.abi?.inputs || [];
    return fInputs.every((input, idx) => validateAndParse(input.type, inputs[f.name]?.[idx]).ok);
  }, [inputs, validateAndParse]);

  const prepareArgs = useCallback((f) => {
    return (f.abi?.inputs || []).map((input, idx) => validateAndParse(input.type, inputs[f.name]?.[idx]).data);
  }, [inputs, validateAndParse]);

  useEffect(() => {
    if (chainId && !config.advancedMode) {
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
      loadPreselected(activeTab);
    }
  }, [chainId, config.advancedMode, activeTab]);

  const updateGlobalConfig = (k, v) => setConfig({ ...config, [k]: v });

  const blockExplorerUrl = BLOCK_EXPLORERS[chainId];

  return (
    <div style={containerStyle}>
        <BoxWrapper title={t('Settings')}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <select value={config.theme} onChange={(e) => updateGlobalConfig('theme', e.target.value)} style={dropdownStyle}>
              {['matrix', 'dracula', 'solarized-dark', 'solarized-light', 'white'].map(t => <option key={t} value={t}>THEME: {t.toUpperCase()}</option>)}
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

        <BoxWrapper title={t('Links')}>
          <div style={{ fontSize: '10px' }}>
            - <a href="https://discord.gg/C4UJjv58ya" target="_blank" style={linkStyle}>https://discord.gg/C4UJjv58ya (DISCORD_SRV)</a><br/>
            - <a href="https://blumeltoken.github.io/legacy/" target="_blank" style={linkStyle}>https://blumeltoken.github.io/legacy/ (blümel.finance legacy version)</a><br/>
            {blockExplorerUrl && CONTRACT_MAPPINGS.token[chainId] && (
              <span>- <a href={`${blockExplorerUrl}/token/${CONTRACT_MAPPINGS.token[chainId]}`} target="_blank" style={linkStyle}>{`${blockExplorerUrl}/token/${CONTRACT_MAPPINGS.token[chainId]}`} (TOKEN)</a><br/></span>
            )}
          </div>
        </BoxWrapper>

        <BoxWrapper title={t('Wallet')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--fg)', flex: 1, minWidth: 0 }}>
                {isConnected ? <AddressDisplay address={address} blockExplorerUrl={blockExplorerUrl} /> : t('Disconnected')}
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <select onChange={(e) => switchChain({ chainId: Number(e.target.value) })} value={chainId} style={dropdownStyle}>
                <optgroup label={t('Production')}>
                  {mainnets.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                </optgroup>
                <optgroup label="────────────────" disabled />
                <optgroup label={t('Test_Networks')}>
                  {testnets.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                </optgroup>
              </select>
              <button onClick={() => isConnected ? disconnect() : connect({ connector: injected() })} style={btnStyle}>
                {isConnected ? t('Disconnect') : t('Connect')}
              </button>
            </div>
          </div>
        </BoxWrapper>

        {!config.advancedMode ? (
          <BoxWrapper title={t('Preset_Actions')}>
            <select onChange={(e) => setActiveTab(e.target.value)} value={activeTab} style={{ ...dropdownStyle, width: '100%' }}>
              <option value="claim">{t('Claim_Gas_And_Greet')}</option>
              <option value="faucet">{t('Faucet_Request')}</option>
              <option value="community">{t('Build_Community')}</option>
            </select>
          </BoxWrapper>
        ) : (
          <BoxWrapper title={t('ABI_Input')}>
            <textarea value={abiText} onChange={e => setAbiText(e.target.value)} style={areaStyle} placeholder={t('Paste_ABI_JSON')} />
            <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
              <input value={targetAddress} onChange={e => setTargetAddress(e.target.value)} style={{ ...areaStyle, height: '22px', marginTop: 0, flexGrow: 1 }} placeholder="0x..." />
              <button onClick={() => {
                try {
                  const parsed = JSON.parse(abiText);
                  setActiveFunctions(parsed.filter(f => f.type === 'function').map(a => ({ 
                    name: a.name, abi: a, target: targetAddress, isView: a.stateMutability === 'view'
                  })));
                } catch(e) { alert(t("Invalid ABI")); }
              }} style={btnStyle}>{t('Parse')}</button>
            </div>
          </BoxWrapper>
        )}

        <div style={{ padding: '0 5px' }}>
          {activeFunctions.map((f, i) => (
            <FunctionRow 
              key={`${f.name}-${i}-${chainId}`}
              f={f} 
              i={i} 
              zaehler={zaehler} 
              inputs={inputs} 
              handleInputChange={handleInputChange} 
              isRowValid={isRowValid}
              prepareArgs={prepareArgs}
              writeContract={writeContract}
              t={t}
              blockExplorerUrl={blockExplorerUrl}
              handlePresetClick={handlePresetClick}
              address={address}
              validateAndParse={validateAndParse}
            />
          ))}
        </div>
    </div>
  );
}

const containerStyle = { padding: '10px', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'monospace', height: '100%', overflowY: 'auto' };
const btnStyle = { background: 'transparent', color: 'var(--fg)', border: '1px solid var(--fg)', fontSize: '9px', cursor: 'pointer', padding: '2px 6px', outline: 'none' };
const dropdownStyle = { background: 'var(--bg)', color: 'var(--fg)', border: '1px solid var(--border)', fontSize: '9px', outline: 'none' };
const funcRowStyle = { borderBottom: '1px solid var(--border)', padding: '12px 0' };
const areaStyle = { width: '100%', background: 'var(--bg)', color: 'var(--fg)', border: '1px solid var(--border)', fontSize: '10px', marginTop: '5px', outline: 'none', resize: 'none', fontFamily: 'monospace' };
const paramInputStyle = { background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', color: 'var(--fg)', fontSize: '10px', outline: 'none' };
const linkStyle = { color: 'var(--fg)', textDecoration: 'none' };
const errorTextStyle = { position: 'absolute', right: 0, bottom: '-10px', color: '#f00', fontSize: '7px', fontWeight: 'bold' };
