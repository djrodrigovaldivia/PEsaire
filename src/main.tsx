import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Register service worker in production environments
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Offline fallback handling
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
