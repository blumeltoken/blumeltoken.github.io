import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain, useWriteContract } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function CommandCenter() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();

  const [selectedChain, setSelectedChain] = useState(chainId);
  const [abiText, setAbiText] = useState('');
  const [functions, setFunctions] = useState([]);

  const { writeContract } = useWriteContract();
  const [targetAddress, setTargetAddress] = useState('');
  // Local state to track inputs for each function: { [funcName]: { [paramIndex]: value } }
  const [inputs, setInputs] = useState({});

  useEffect(() => {
    setSelectedChain(chainId);
  }, [chainId]);

  const currentChain = chains.find((c) => c.id === chainId);

  const handleParse = () => {
    try {
      const parsed = JSON.parse(abiText);
      setFunctions(parsed.filter(f => f.type === 'function'));
      if (window.term) window.term.writeln('\x1b[32m[SYS] ABI_LOADED\x1b[0m');
    } catch (e) { 
      if (window.term) window.term.writeln('\x1b[31m[ERR] ABI_INVALID\x1b[0m'); 
    }
  };

  const handleInputChange = (funcName, index, value) => {
    setInputs(prev => ({
      ...prev,
      [funcName]: { ...prev[funcName], [index]: value }
    }));
  };

  const executeFunction = (f) => {
    const args = f.inputs.map((_, i) => inputs[f.name]?.[i]);
    
    writeContract({
      address: targetAddress,
      abi: functions,
      functionName: f.name,
      args: args,
    });
  };

  // Validation check: Is targetAddress valid and are all inputs filled?
  const isReady = (f) => {
    const hasAddress = targetAddress.startsWith('0x') && targetAddress.length === 42;
    const funcInputs = inputs[f.name] || {};
    const allInputsFilled = f.inputs.every((_, i) => funcInputs[i] !== undefined && funcInputs[i] !== '');
    return hasAddress && allInputsFilled;
  };

  return (
    <div style={{ padding: '10px', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'monospace', fontSize: '11px', height: '100%', overflowY: 'auto' }}>

      {/* LINKS SECTION */}
      <div style={boxStyle}>
        [ LINKS ] 
        <br/>- <a href="https://discord.gg/C4UJjv58ya" target="_blank" style={{color: 'var(--fg)', textDecoration: 'none'}}>DISCORD_SRV https://discord.gg/C4UJjv58ya</a>
        <br/>- <a href="legacy/" target="_blank" style={{color: 'var(--fg)', textDecoration: 'none'}}>blümel.finance legacy version</a>
      </div>

      {/* WALLET_SYSTEM SECTION */}
      <div style={boxStyle}>
        <div style={{ marginBottom: '5px' }}>[ WALLET_SYSTEM ]</div>
        {!isConnected ? (
          <button onClick={() => connect({ connector: injected() })} style={btnStyle}>CONNECT</button>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fff' }}>{address.slice(0,6)}...{address.slice(-4)}</span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <select 
                onChange={(e) => switchChain({ chainId: Number(e.target.value) })}
                value={selectedChain}
                style={dropdownStyle}
              >
                {chains.map((chain) => (
                  <option key={chain.id} value={chain.id}>{chain.name.toUpperCase()}</option>
                ))}
              </select>
              <button onClick={() => disconnect()} style={btnStyle}>DISCONNECT</button>
            </div>
          </div>
        )}
      </div>

      {/* ABI & CONTRACT INPUT */}
      <div style={boxStyle}>
        <div>[ ABI_INPUT ]</div>
        <textarea 
          placeholder="Paste ABI JSON here..."
          onChange={e => setAbiText(e.target.value)} 
          style={areaStyle} 
        />
        <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
          <input 
            placeholder="CONTRACT_ADDRESS (0x...)"
            value={targetAddress}
            onChange={e => setTargetAddress(e.target.value)}
            style={{ ...areaStyle, height: '20px', marginTop: '0', flexGrow: 1 }}
          />
          <button onClick={handleParse} style={btnStyle}>PARSE</button>
        </div>
      </div>

      {/* GENERATED FUNCTIONS */}
      <div>
        {functions.map((f, i) => (
          <div key={f.name + i} style={{ borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: f.inputs.length > 0 ? '8px' : '0' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--fg)' }}>{f.name.toUpperCase()}</span>
              <button 
                disabled={!isReady(f)}
                onClick={() => executeFunction(f)} 
                style={{ 
                  ...btnStyle, 
                  opacity: isReady(f) ? 1 : 0.3,
                  cursor: isReady(f) ? 'pointer' : 'not-allowed',
                  border: isReady(f) ? '1px solid var(--fg)' : '1px solid #444'
                }}
              >
                RUN
              </button>
            </div>
            
            {/* PARAMETER INPUTS */}
            {f.inputs.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '10px' }}>
                {f.inputs.map((input, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ color: '#555', fontSize: '9px' }}>{input.name || `arg${idx}`}({input.type}):</span>
                    <input 
                      style={paramInputStyle}
                      onChange={(e) => handleInputChange(f.name, idx, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const boxStyle = { border: '1px solid var(--border)', padding: '8px', marginBottom: '10px' };
const btnStyle = { background: 'transparent', color: 'var(--fg)', border: '1px solid var(--fg)', cursor: 'pointer', fontSize: '9px', padding: '1px 4px' };
const dropdownStyle = { background: '#000', color: 'var(--fg)', border: '1px solid var(--fg)', fontSize: '9px', fontFamily: 'monospace', outline: 'none' };
const areaStyle = { width: '100%', background: '#000', color: '#0f0', border: '1px solid var(--border)', fontSize: '10px', marginTop: '5px', fontFamily: 'monospace' };
const paramInputStyle = { background: 'transparent', border: 'none', borderBottom: '1px solid #222', color: '#fff', fontSize: '10px', fontFamily: 'monospace', outline: 'none', flexGrow: 1 };
