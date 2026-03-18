import React, { useState, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { ConfigContext } from '../App';

export default function NotesView({ blumenwieseVisible }) {
    const { config, todotxt, readmetxt, setBlumenwieseVisible } = useContext(ConfigContext);
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('readme');

    const currentContent = activeTab === 'todo' ? todotxt : readmetxt;

    const handleTabClick = (tab) => {
        if (tab === 'blumenwiese') {
            setBlumenwieseVisible(true);
        } else {
            setBlumenwieseVisible(false);
            setActiveTab(tab);
        }
    };

    const renderTabs = () => (
        <div style={tabContainerStyle}>
            <div style={tabsStyle}>
                <button
                    onClick={() => handleTabClick('todo')}
                    style={!blumenwieseVisible && activeTab === 'todo' ? activeTabStyle : tabBtnStyle}
                >
                    {t('notes.todo')}
                </button>
                <button
                    onClick={() => handleTabClick('readme')}
                    style={!blumenwieseVisible && activeTab === 'readme' ? activeTabStyle : tabBtnStyle}
                >
                    {t('notes.readme')}
                </button>
                <button
                    onClick={() => handleTabClick('blumenwiese')}
                    style={blumenwieseVisible ? activeTabStyle : tabBtnStyle}
                >
                    {t('blumenwiese')}
                </button>
            </div>
        </div>
    );

    if (blumenwieseVisible) {
        return <div className={`theme-${config.theme}`} style={containerStyle}>{renderTabs()}</div>;
    }

    return (
        <div style={containerStyle} className={`theme-${config.theme}`}>
            {renderTabs()}
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
    height: '100%',
    overflow: 'hidden',
};

const tabContainerStyle = {
    padding: '5px 5px 0 5px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg)',
};

const tabsStyle = {
    display: 'flex',
};

const tabBtnStyle = {
    background: 'var(--bg-alt)',
    border: '1px solid var(--border)',
    borderBottom: 'none',
    color: 'var(--fg)',
    padding: '8px 16px',
    cursor: 'pointer',
    opacity: 0.7,
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    marginRight: '2px',
    transition: 'opacity 0.2s ease-in-out, background 0.2s ease-in-out',
};

const activeTabStyle = {
    ...tabBtnStyle,
    opacity: 1,
    background: 'var(--bg-alt)',
    position: 'relative',
    top: '1px',
    borderBottom: '1px solid var(--bg-alt)',
};

const markdownBodyStyle = {
    padding: '10px',
    overflowY: 'auto',
    height: '100%',
    background: 'var(--bg-alt)',
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
};
