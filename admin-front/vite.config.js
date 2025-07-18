import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:714',
      '/users': 'http://localhost:714',
      '/inquiry': 'http://localhost:714',
      '/stadium': 'http://localhost:714',
      '/board': 'http://localhost:714'
    }
  }
})
