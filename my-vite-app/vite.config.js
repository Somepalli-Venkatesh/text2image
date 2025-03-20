import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // your Flask backend port
        changeOrigin: true,
      }
    }
  },
  optimizeDeps: {
    include: ['lodash.isequal']
  },
  resolve: {
    alias: {
      // Map "lodash/isEqual" to the installed lodash.isequal package
      'lodash/isEqual': 'lodash.isequal'
    }
  }
})
