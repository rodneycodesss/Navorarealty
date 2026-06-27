import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Dynamic API Base URL Fetch Interceptor for production environments (e.g. Cloudflare)
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  let url = typeof input === 'string' ? input : (input && input.url);
  if (url && url.startsWith('http://localhost:8000')) {
    // If hosted on local machine, use local FastAPI port, otherwise route requests to Render backend
    const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const productionBackend = 'https://navorarealty.onrender.com';
    const apiBase = import.meta.env.VITE_API_URL || (isLocalDev ? 'http://localhost:8000' : productionBackend);
    
    url = url.replace('http://localhost:8000', apiBase);
    if (typeof input === 'string') {
      input = url;
    } else {
      input = new Request(url, input);
    }
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
