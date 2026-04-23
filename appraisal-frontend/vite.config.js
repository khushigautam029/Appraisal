import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const createProxyConfig = (path) => ({
  target: 'http://localhost:8080',
  changeOrigin: true,
  secure: false,
  cors: true,
  configure: (proxy) => {
    proxy.on('proxyReq', (proxyReq, req, res) => {
      const token = req.headers['authorization'];
      if (token) {
        proxyReq.setHeader('Authorization', token);
        console.log(`[PROXY] Path: ${path} - Token forwarded`);
      } else {
        console.warn(`[PROXY] Path: ${path} - ⚠️ No Authorization header found`);
      }
    });
    
    proxy.on('error', (err, req, res) => {
      console.error(`[PROXY] Error on ${path}:`, err.message);
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': createProxyConfig('/api'),
      '/auth': createProxyConfig('/auth'),
      '/notifications': createProxyConfig('/notifications'),
      '/hr': createProxyConfig('/hr'),
      '/employee': createProxyConfig('/employee'),
      '/manager': createProxyConfig('/manager'),
      '/cycles': createProxyConfig('/cycles'),
      '/goal': createProxyConfig('/goal'),
      '/review': createProxyConfig('/review'),
      '/self-evaluation': createProxyConfig('/self-evaluation'),
      '/email': createProxyConfig('/email'),
      '/health': createProxyConfig('/health')
    }
  }
})
