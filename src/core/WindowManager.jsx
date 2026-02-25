import React, { useContext } from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import { useTranslation } from 'react-i18next';
import { ConfigContext } from '../App';

import "react-mosaic-component/react-mosaic-component.css";
import "@blueprintjs/core/lib/css/blueprint.css";

import TerminalView from '../components/Views/TerminalView';
import ConfigView from '../components/Views/ConfigView';
import CommandCenter from '../components/Views/CommandCenter';
import NotesView from '../components/Views/NotesView';
import TodoView from '../components/Views/TodoView';

const VIEW_MAP = {
  terminal: <TerminalView />,
  config: <ConfigView />,
  commands: <CommandCenter />,
  notes: <NotesView />,
  todo: <TodoView />,
};

export default function WindowManager() {
  const { configText } = useContext(ConfigContext);
  const { t } = useTranslation();
  
  let parsed;
  try {
    parsed = JSON.parse(configText);
  } catch (e) {
    return <div style={{color: 'red', background: '#000', height: '100vh', padding: '20px'}}>{t('JSON_PARSE_ERROR')}: {e.message}</div>;
  }

  const isLightTheme = parsed.theme === 'solarized' || parsed.theme === 'light';
  const blueprintTheme = isLightTheme ? 'bp4-light' : 'bp4-dark';

  return (
    <div className={`theme-${parsed.theme}`} style={{ width: '100vw', height: '100vh', background: 'var(--bg)' }}>
      <Mosaic
        className={blueprintTheme}
        renderTile={(id, path) => (
          <MosaicWindow path={path} title={id.toUpperCase()} toolbarControls={[]}>
            {VIEW_MAP[id] || <div>{t('NULL_VIEW')}</div>}
          </MosaicWindow>
        )}
        value={parsed.layout}
        onChange={() => {}} 
      />
    </div>
  );
}
