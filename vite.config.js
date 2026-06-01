import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  root: '.',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 5173,
    host: true,
    // During development, proxy /api requests to the backend server.
    // Set BACKEND_URL to override the default (http://localhost:8008).
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:8008',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
