import React from 'react';

export default function BoxWrapper({ title, children, style = {} }) {
  return (
    <div style={{ border: '1px solid var(--border)', padding: '10px', marginBottom: '12px', position: 'relative', ...style }}>
      <div style={{ position: 'absolute', top: '-7px', left: '10px', background: 'var(--bg)', padding: '0 5px', color: '#555', fontSize: '9px' }}>
        [ {title.toUpperCase()} ]
      </div>
      {children}
    </div>
  );
}
