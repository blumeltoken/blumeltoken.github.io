import React, { useState, useEffect, createContext } from 'react';
import { useTranslation } from 'react-i18next';
import WindowManager from './core/WindowManager';
import { Web3Wrapper } from './core/Web3Provider';
import NotesView from './views/NotesView';
import Blumenwiese from './views/Blumenwiese';
import './App.css';

export const ConfigContext = createContext();

function useWindowSize() {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
    useEffect(() => {
        const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return size;
}

export default function App() {
    const { i18n, t } = useTranslation();
    const [config, setConfig] = useState(() => {
        const savedConfig = localStorage.getItem('config');
        return savedConfig ? JSON.parse(savedConfig) : {
            theme: 'matrix',
            layout: {
                direction: 'row',
                first: 'notes',
                second: 'commands',
                splitPercentage: 50,
            },
            advancedMode: false,
        };
    });

    const [width] = useWindowSize();
    const [blumenwieseVisible, setBlumenwieseVisible] = useState(false);

    useEffect(() => {
        document.title = t('app_title');
    }, [i18n.language, t]);

    useEffect(() => {
        // One-time fix for users with the old layout config
        if (config.layout.first === 'commands') {
            setConfig(c => ({
                ...c,
                layout: { ...c.layout, first: 'notes', second: 'commands' },
            }));
        }
    }, []); // Empty dependency array ensures this runs only once

    useEffect(() => {
        const isMobile = width < 768;
        const newDirection = isMobile ? 'column' : 'row';
        if (config.layout.direction !== newDirection) {
            setConfig(c => ({
                ...c,
                layout: { ...c.layout, direction: newDirection },
            }));
        }
    }, [width, config.layout.direction, setConfig]);

    useEffect(() => {
        localStorage.setItem('config', JSON.stringify(config));
    }, [config]);

    const [todotxt, setTodotxt] = useState('');
    const [readmetxt, setReadmetxt] = useState('');

    const fetchFiles = (lang) => {
        const fetchPromises = [
            fetch(`/todo.${lang}.md`).then(res => res.ok ? res.text() : ''),
            fetch(`/readme.${lang}.md`).then(res => res.ok ? res.text() : ''),
            fetch(`/todo.en.md`).then(res => res.text()), // Fallback to English
            fetch(`/readme.en.md`).then(res => res.text()), // Fallback to English
        ];

        Promise.all(fetchPromises).then(results => {
            setTodotxt(results[0] || results[2]);
            setReadmetxt(results[1] || results[3]);
        });
    };

    useEffect(() => {
        if (i18n.isInitialized) {
            fetchFiles(i18n.language.split('-')[0]);
        }
    }, [i18n.isInitialized, i18n.language]);

    const contextValue = {
        config,
        todotxt,
        readmetxt,
        setConfig,
        setBlumenwieseVisible,
    };

    if (blumenwieseVisible) {
        return (
            <Web3Wrapper>
                <ConfigContext.Provider value={contextValue}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
                        <NotesView blumenwieseVisible={blumenwieseVisible} />
                        <Blumenwiese />
                    </div>
                </ConfigContext.Provider>
            </Web3Wrapper>
        );
    }

    return (
        <Web3Wrapper>
            <ConfigContext.Provider value={contextValue}>
                <WindowManager />
            </ConfigContext.Provider>
        </Web3Wrapper>
    );
}