import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),commonjs()],
  server: {
    open: true,
    proxy:{
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
