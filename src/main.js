import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from '@/app/App.tsx';
import '@/styles/index.css';
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element #root was not found.');
}
createRoot(rootElement).render(_jsx(StrictMode, { children: _jsx(BrowserRouter, { children: _jsx(App, {}) }) }));
