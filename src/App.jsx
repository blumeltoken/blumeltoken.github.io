import React, { useState, createContext } from 'react';
import WindowManager from './core/WindowManager';

export const ConfigContext = createContext();

export default function App() {
  // This is the "Text File" that controls your whole website
  const [configText, setConfigText] = useState(JSON.stringify({
    layout: {
      direction: 'row',
      first: {
	direction: 'column',
	first: 'terminal',
	second: 'todo',
      },
      second: {
        direction: 'column',
        first: 'commands',
        second: 'config',
      },
    },
    theme: 'matrix'
  }, null, 2));

  return (
    <ConfigContext.Provider value={{ configText, setConfigText }}>
      <WindowManager />
    </ConfigContext.Provider>
  );
}
