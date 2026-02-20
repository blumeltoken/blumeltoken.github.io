import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function CommandCenter() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [abiText, setAbiText] = useState('');
  const [functions, setFunctions] = useState([]);

  const handleParse = () => {
    try {
      const parsed = JSON.parse(abiText);
      setFunctions(parsed.filter(f => f.type === 'function'));
      if (window.term) window.term.writeln('\x1b[32m[SYS] ABI_LOADED\x1b[0m');
    } catch (e) { if (window.term) window.term.writeln('\x1b[31m[ERR] ABI_INVALID\x1b[0m'); }
  };

  return (
    <div style={{ padding: '10px', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'monospace', fontSize: '11px', height: '100%', overflowY: 'auto' }}>
      <div style={boxStyle}>
        <div>[ WALLET ]</div>
        {isConnected ? (
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <span>{address.slice(0,10)}...</span>
            <button onClick={() => disconnect()} style={btnStyle}>EXIT</button>
          </div>
        ) : (
          <button onClick={() => connect({ connector: injected() })} style={btnStyle}>CONNECT</button>
        )}
      </div>

      <div style={boxStyle}>
        <div>[ ABI_INPUT ]</div>
        <textarea onChange={e => setAbiText(e.target.value)} style={areaStyle} />
        <button onClick={handleParse} style={btnStyle}>PARSE</button>
      </div>

      <div>
        {functions.map((f, i) => (
          <div key={i} style={{borderBottom: '1px solid var(--border)', padding: '5px 0', display: 'flex', justifyContent: 'space-between'}}>
            <span>{f.name}</span>
            <button style={{background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border)'}}>RUN</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const boxStyle = { border: '1px solid var(--border)', padding: '8px', marginBottom: '10px' };
const btnStyle = { background: 'transparent', color: 'var(--fg)', border: '1px solid var(--fg)', cursor: 'pointer', fontSize: '10px', marginTop: '5px' };
const areaStyle = { width: '100%', background: '#000', color: '#0f0', border: '1px solid var(--border)', height: '40px', fontSize: '10px' };
