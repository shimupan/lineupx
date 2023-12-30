import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { CookiesPopup } from './Components';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
      <App />
      <CookiesPopup />
   </React.StrictMode>,
);
