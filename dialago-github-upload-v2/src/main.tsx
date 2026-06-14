import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { MobileApp } from './app/MobileApp';
import './styles.css';

function isAppRoute(): boolean {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return path === '/app' || path.startsWith('/app/');
}

function Root() {
  const [route] = useState(isAppRoute);
  return route ? <MobileApp /> : <App />;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
