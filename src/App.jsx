import React, { useState, useEffect, createContext } from 'react';
import WindowManager from './core/WindowManager';
import { useTranslation } from 'react-i18next';
import './App.css';

export const ConfigContext = createContext();

export default function App() {
  const { t, i18n } = useTranslation();
  const [width, setWidth] = useState(window.innerWidth);

  const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: light)').matches ? 'white' : 'matrix';

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const direction = width > 1000 ? "row" : "column";

  const [config, setConfig] = useState({
    theme: getSystemTheme(),
    advancedMode: false,
    layout: {
      direction: direction,
      first: "notes",
      second: "commands"
    }
  });

  useEffect(() => {
    setConfig(prev => {
      if (prev.layout.direction !== direction) {
        return {
          ...prev,
          layout: {
            ...prev.layout,
            direction: direction
          }
        };
      }
      return prev;
    });
  }, [direction]);

  useEffect(() => {
    document.title = t("app_title");
  }, [i18n.language, t]);

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      <WindowManager />
    </ConfigContext.Provider>
  );
}
