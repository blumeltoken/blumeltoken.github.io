import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';

export default function NotesView() {
  const { i18n } = useTranslation();
  const [todoContent, setTodoContent] = useState('LOADING_TODO...');
  const [readmeContent, setReadmeContent] = useState('LOADING_README...');
  const [activeTab, setActiveTab] = useState('readme'); // 'todo' or 'readme'

  const fetchFiles = () => {
    const timestamp = Date.now();
    const lang = (i18n.language || 'en').split('-')[0];
    
    // Fetch todo.md
    fetch(`./todo.${lang}.md?t=${timestamp}`)
      .then(res => res.ok ? res.text() : Promise.reject("TODO_NOT_FOUND"))
      .then(text => setTodoContent(text))
      .catch(err => setTodoContent(`### ERR_LOAD_TODO\n${err}`));

    // Fetch readme.md
    fetch(`./readme.${lang}.md?t=${timestamp}`)
      .then(res => res.ok ? res.text() : Promise.reject("README_NOT_FOUND"))
      .then(text => setReadmeContent(text))
      .catch(err => setReadmeContent(`### ERR_LOAD_README\n${err}`));
  };

  useEffect(() => {
    if (i18n.isInitialized) {
      fetchFiles();
    }
  }, [i18n.isInitialized, i18n.language]);


  const currentContent = activeTab === 'todo' ? todoContent : readmeContent;

  return (
    <div style={containerStyle}>
      <div style={tabContainerStyle}>
        <div style={tabsStyle}>
          <button 
            onClick={() => setActiveTab('todo')} 
            style={activeTab === 'todo' ? activeTabStyle : tabBtnStyle}
          >
            todo.md
          </button>
          <button 
            onClick={() => setActiveTab('readme')} 
            style={activeTab === 'readme' ? activeTabStyle : tabBtnStyle}
          >
            readme.md
          </button>
        </div>
        <button onClick={fetchFiles} style={refreshBtnStyle}>SYNC_FILES</button>
      </div>

      <div className="markdown-body" style={markdownBodyStyle}>
        <ReactMarkdown>{currentContent}</ReactMarkdown>
      </div>
    </div>
  );
}

/* --- SYSTEM STYLES --- */
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--bg)',
  color: 'var(--fg)',
  fontFamily: 'monospace',
  height: '100%',
  overflow: 'hidden'
};

const tabContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid var(--border)',
  padding: '5px 10px'
};

const tabsStyle = {
  display: 'flex',
  gap: '10px'
};

const tabBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--border)',
  fontSize: '10px',
  cursor: 'pointer',
  padding: '5px'
};

const activeTabStyle = {
  ...tabBtnStyle,
  color: 'var(--fg)',
  borderBottom: '1px solid var(--fg)'
};

const refreshBtnStyle = {
  background: 'transparent',
  border: '1px solid var(--border)',
  color: 'var(--fg)',
  fontSize: '9px',
  cursor: 'pointer',
  padding: '2px 6px'
};

const markdownBodyStyle = {
  padding: '15px',
  overflowY: 'auto',
  flexGrow: 1,
  lineHeight: '1.5',
  userSelect: 'text' // Allows copying, but prevents editing
};
