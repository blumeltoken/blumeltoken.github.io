import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigContext } from '../../App';

export default function ConfigView() {
  const { configText, setConfigText } = useContext(ConfigContext);
  const [localText, setLocalText] = useState(configText);
  const { t } = useTranslation();

  return (
    <div style={{ height: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <button onClick={() => setConfigText(localText)} style={{ background: 'var(--border)', color: 'var(--fg)', border: 'none', padding: '5px', cursor: 'pointer' }}>
        {t('APPLY_CHANGES')}
      </button>
      <textarea
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        style={{ flexGrow: 1, background: 'transparent', color: 'var(--fg)', border: 'none', outline: 'none', fontFamily: 'monospace', padding: '10px', resize: 'none' }}
      />
    </div>
  );
}
