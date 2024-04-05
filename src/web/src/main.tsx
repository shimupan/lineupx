import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { CookiesPopup } from './Components';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
      <BrowserRouter>
         <App />
         <CookiesPopup />
      </BrowserRouter>
   </React.StrictMode>,
);
