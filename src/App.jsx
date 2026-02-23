import React, { useState, useEffect, createContext } from 'react';
import WindowManager from './core/WindowManager';

export const ConfigContext = createContext();

export default function App() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update layout based on width
  const direction = width > 1000 ? "row" : "column";

  const [configText, setConfigText] = useState(JSON.stringify({
    theme: "matrix",
    advancedMode: false,
    layout: {
      direction: direction,
      first: "todo",
      second: "commands"
    }
  }, null, 2));

  // Sync direction if width changes
  useEffect(() => {
    setConfigText(prev => {
      const current = JSON.parse(prev);
      if (current.layout.direction !== direction) {
        current.layout.direction = direction;
        return JSON.stringify(current, null, 2);
      }
      return prev;
    });
  }, [direction]);

  return (
    <ConfigContext.Provider value={{ configText, setConfigText }}>
      <WindowManager />
    </ConfigContext.Provider>
  );
}
