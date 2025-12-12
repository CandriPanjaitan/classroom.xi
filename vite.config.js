import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Server saat development (opsional)
  server: {
    port: 5173,
    open: true
  },

  // Build untuk produksi (Vercel)
  build: {
    outDir: 'dist'
  }
})
