import React, { useContext } from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import { ConfigContext } from '../App';

import "react-mosaic-component/react-mosaic-component.css";
import "@blueprintjs/core/lib/css/blueprint.css";

import TerminalView from '../components/Views/TerminalView';
import ConfigView from '../components/Views/ConfigView';
import CommandCenter from '../components/Views/CommandCenter';
import TodoView from '../components/Views/TodoView';

const VIEW_MAP = {
  terminal: <TerminalView />,
  config: <ConfigView />,
  commands: <CommandCenter />,
  todo: <TodoView />,
};

export default function WindowManager() {
  const { configText } = useContext(ConfigContext);
  
  let parsed;
  try {
    parsed = JSON.parse(configText);
  } catch (e) {
    return <div style={{color: 'red', background: '#000', height: '100vh', padding: '20px'}}>JSON_PARSE_ERROR: {e.message}</div>;
  }

  return (
    <div className={`theme-${parsed.theme}`} style={{ width: '100vw', height: '100vh', background: 'var(--bg)' }}>
      <Mosaic
        renderTile={(id, path) => (
          <MosaicWindow path={path} title={id.toUpperCase()}>
            {VIEW_MAP[id] || <div>NULL_VIEW</div>}
          </MosaicWindow>
        )}
        value={parsed.layout}
        onChange={() => {}} 
      />
    </div>
  );
}
