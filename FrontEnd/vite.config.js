import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Nếu backend mount path là /owner, /auth, /vet
      '/owner': 'http://localhost:3000',
      '/auth': 'http://localhost:3000',
      '/vet': 'http://localhost:3000',
      
    }
  }
})
