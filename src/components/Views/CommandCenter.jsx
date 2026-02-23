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

  useEffect(() => {
	  setSelectedChain(chainId);
  }, [chainId]);

  const currentChain  = chains.find((c) => c.id === chainId);

  const handleParse = () => {
    try {
      const parsed = JSON.parse(abiText);
      setFunctions(parsed.filter(f => f.type === 'function'));
      if (window.term) window.term.writeln('\x1b[32m[SYS] ABI_LOADED\x1b[0m');
    } catch (e) { if (window.term) window.term.writeln('\x1b[31m[ERR] ABI_INVALID\x1b[0m'); }
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
            {/* Left Side: Address and Chain Name */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fff' }}>{address.slice(0,6)}...{address.slice(-4)}</span>
            </div>

            {/* Right Side: Action Buttons */}
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

      <div style={boxStyle}>
        <div>[ ABI_INPUT ]</div>
        <textarea onChange={e => setAbiText(e.target.value)} style={areaStyle} />
        <button onClick={handleParse} style={btnStyle}>PARSE</button>
      </div>

      <div>
        {functions.map((f, i) => (
          <div key={f.name+i} style={{borderBottom: '1px solid var(--border)', padding: '5px 0', display: 'flex', justifyContent: 'space-between'}}>
            <span>{f.name}</span>
            <button style={{background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border)'}}>RUN</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- ENSURE ALL THESE ARE AT THE BOTTOM --- */
const boxStyle = { border: '1px solid var(--border)', padding: '8px', marginBottom: '10px' };
const btnStyle = { background: 'transparent', color: 'var(--fg)', border: '1px solid var(--fg)', cursor: 'pointer', fontSize: '9px', padding: '1px 4px' };
const dropdownStyle = { background: '#000', color: 'var(--fg)', border: '1px solid var(--fg)', fontSize: '9px', fontFamily: 'monospace', outline: 'none' };
const areaStyle = { width: '100%', background: '#000', color: '#0f0', border: '1px solid var(--border)', height: '40px', fontSize: '10px', marginTop: '5px' };
const smallBtnStyle = { background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border)', fontSize: '9px', cursor: 'pointer' };

