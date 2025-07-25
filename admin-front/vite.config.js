import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://13.125.250.158:714',
      '/users': 'http://13.125.250.158:714',
      '/inquiry': 'http://13.125.250.158:714',
      '/stadium': 'http://13.125.250.158:714',
      '/board': 'http://13.125.250.158:714'
    }
  }
})
