import { useEffect, useRef, useContext } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { ConfigContext } from '../../App';

export default function TerminalView() {
  const termRef = useRef(null);
  const terminalInstance = useRef(null);
  const { configText } = useContext(ConfigContext);
  const config = JSON.parse(configText);

  // Initialize terminal on first render
  useEffect(() => {
    if (termRef.current && !terminalInstance.current) {
      const term = new Terminal({
        fontFamily: 'monospace',
        cursorBlink: true,
        convertEol: true
      });
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(termRef.current);
      fitAddon.fit();
      terminalInstance.current = term;
      window.term = term;

      let command = '';
      term.onData(e => {
        if (e === '\r') {
          term.write('\r\n');
          try {
            const result = window.eval(command);
            term.writeln(`\x1b[32m=> ${result}\x1b[0m`);
          } catch (err) {
            term.writeln(`\x1b[31m! ${err.message}\x1b[0m`);
          }
          command = '';
          term.write('> ');
        } else if (e === '\u007F') {
          if (command.length > 0) {
            command = command.slice(0, -1);
            term.write('\b \b');
          }
        } else {
          command += e;
          term.write(e);
        }
      });

      term.writeln('WEB3_TWM_OS v1.0.0');
      term.write('> ');
    }
  }, []);

  // Update theme when config changes
  useEffect(() => {
    if (terminalInstance.current && termRef.current) {
      const computedStyle = getComputedStyle(termRef.current);
      const bg = computedStyle.getPropertyValue('--bg').trim();
      const fg = computedStyle.getPropertyValue('--fg').trim();
      
      terminalInstance.current.options.theme = {
        background: bg,
        foreground: fg,
        cursor: fg,
      };
    }
  }, [config.theme]);

  return (
    <div 
      ref={termRef} 
      style={{ height: '100%', width: '100%', background: 'var(--bg)' }} 
      onClick={() => terminalInstance.current?.focus()} 
    />
  );
}
