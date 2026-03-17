import React, { useContext } from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import { useTranslation } from 'react-i18next';
import { ConfigContext } from '../App';

import "react-mosaic-component/react-mosaic-component.css";
import "@blueprintjs/core/lib/css/blueprint.css";

import CommandCenter from '../views/CommandCenter';
import NotesView from '../views/NotesView';

const VIEW_MAP = {
  commands: <CommandCenter />,
  notes: <NotesView />,
};

export default function WindowManager() {
  const { config, setConfig } = useContext(ConfigContext);
  const { t } = useTranslation();

  const handleLayoutChange = (newLayout) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      layout: newLayout,
    }));
  };

  const isLightTheme = config.theme === 'white' || config.theme === 'solarized-light';
  const blueprintTheme = isLightTheme ? 'bp4-light' : 'bp4-dark';

  return (
    <div className={`theme-${config.theme}`} style={{ width: '100vw', height: '100vh', background: 'var(--bg)' }}>
      <Mosaic
        className={blueprintTheme}
        renderTile={(id, path) => (
          <MosaicWindow path={path} title={id.toUpperCase()} toolbarControls={[]}>
            {VIEW_MAP[id] || <div>{t('NULL_VIEW')}</div>}
          </MosaicWindow>
        )}
        value={config.layout}
        onChange={handleLayoutChange} 
      />
    </div>
  );
}
