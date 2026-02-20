import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Web3Wrapper } from './core/Web3Provider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Web3Wrapper>
      <App />
    </Web3Wrapper>
  </React.StrictMode>
);
