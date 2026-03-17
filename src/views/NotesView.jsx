import React, { useState, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { ConfigContext } from '../App';

export default function NotesView() {
    const { todotxt, readmetxt } = useContext(ConfigContext);
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('readme');

    const currentContent = activeTab === 'todo' ? todotxt : readmetxt;

    return (
        <div style={containerStyle}>
            <div style={tabContainerStyle}>
                <div style={tabsStyle}>
                    <button
                        onClick={() => setActiveTab('todo')}
                        style={activeTab === 'todo' ? activeTabStyle : tabBtnStyle}
                    >
                        {t('notes.todo')}
                    </button>
                    <button
                        onClick={() => setActiveTab('readme')}
                        style={activeTab === 'readme' ? activeTabStyle : tabBtnStyle}
                    >
                        {t('notes.readme')}
                    </button>
                </div>
            </div>

            <div className="markdown-body" style={markdownBodyStyle}>
                <ReactMarkdown>{currentContent}</ReactMarkdown>
            </div>
        </div>
    );
}

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg)',
    color: 'var(--fg)',
    fontFamily: 'monospace',
    height: '100%',
    overflow: 'hidden',
};

const tabContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px',
    borderBottom: '1px solid var(--border)',
};

const tabsStyle = {
    display: 'flex',
};

const tabBtnStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--fg)',
    padding: '5px 10px',
    cursor: 'pointer',
    opacity: 0.6,
};

const activeTabStyle = {
    ...tabBtnStyle,
    opacity: 1,
    textDecoration: 'underline',
};

const markdownBodyStyle = {
    padding: '10px',
    overflowY: 'auto',
    height: '100%',
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
};
