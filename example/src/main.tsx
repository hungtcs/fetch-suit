import React from 'react';
import App from './app/app';
import { createRoot } from 'react-dom/client';
import { applyInterceptors } from '@fetch-suit/fetch-interceptor';

const root = createRoot(document.getElementById('app')!);

root.render(<App />);

(window as any).applyInterceptors = applyInterceptors;
