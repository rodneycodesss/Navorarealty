import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Dynamic API Base URL Fetch Interceptor for production environments (e.g. Cloudflare)
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  let url = typeof input === 'string' ? input : (input && input.url);
  if (url && url.startsWith('http://localhost:8000')) {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
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
