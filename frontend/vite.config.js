import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // <--- O SEGREDO ESTÁ AQUI
    },
    host: true, // Necessário para o Docker
    strictPort: true,
    port: 5173, 
  }
})