import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Bundle dependencies into the server build so the VPS needs no npm install
  ssr: { noExternal: true },
})