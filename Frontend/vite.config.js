import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Bundle dependencies into the server build so the VPS needs no npm install
  ssr: { noExternal: true },

  // Dev only (npm run dev -- --host). Ignored by `vite build`.
  server: {
    allowedHosts: true, // lets you open it by your Mac's .local name
    proxy: {
      '/api': {
        target: 'https://api.impilomag.co.za',
        changeOrigin: true,
        // the live API only trusts impilomag origins, so don't forward your LAN origin
        configure: (proxy) =>
          proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin')),
      },
    },
  },
})