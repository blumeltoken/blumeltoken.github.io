import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';

export default function TodoView() {
  const { i18n } = useTranslation();
  const [content, setContent] = useState('LOADING_SYSTEM_FILE...');

  const fetchTodo = () => {
    const lang = i18n.language || 'en';
    fetch(`./todo.${lang}.md?t=${Date.now()}`)
      .then(res => {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          throw new Error("FILE_NOT_FOUND");
        }
        return res.text();
      })
      .then(text => setContent(text))
      .catch(err => setContent(`### ERR_LOAD\n${err.message}\n\nEnsure file is in \`/public/todo.md\``));
  };

  useEffect(() => {
    fetchTodo();
  }, [i18n.language]);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button onClick={fetchTodo} style={refreshBtnStyle}>REFRESH</button>
      </div>
      <div className="markdown-body">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

/* --- STYLES --- */
const containerStyle = {
  padding: '15px',
  background: 'var(--bg)',
  color: 'var(--fg)',
  fontFamily: 'monospace',
  height: '100%',
  overflowY: 'auto',
  lineHeight: '1.5'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  color: 'var(--fg)',
  borderBottom: '1px solid var(--border)',
  paddingBottom: '5px',
  marginBottom: '15px',
  fontSize: '10px'
};

const refreshBtnStyle = {
  background: 'transparent',
  border: '1px solid var(--border)',
  color: 'var(--fg)',
  fontSize: '9px',
  cursor: 'pointer'
};
