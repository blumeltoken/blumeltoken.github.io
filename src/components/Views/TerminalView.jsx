import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

export default function TerminalView() {
  const termRef = useRef(null);
  const terminalInstance = useRef(null);

  useEffect(() => {
    if (terminalInstance.current) return;

    const term = new Terminal({
      theme: { background: '#000', foreground: '#0f0', cursor: '#0f0' },
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
  }, []);

  return <div ref={termRef} style={{ height: '100%', width: '100%', background: '#000' }} onClick={() => terminalInstance.current?.focus()} />;
}
