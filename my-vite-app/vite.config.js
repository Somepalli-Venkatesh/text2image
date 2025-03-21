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
        target: 'https://text2image-backend.onrender.com', // updated backend URL
        changeOrigin: true,
        secure: true, // ensure this is true if your backend uses HTTPS with a valid certificate
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
