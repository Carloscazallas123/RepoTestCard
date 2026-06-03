import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Corrige el problema de compatibilidad de SockJS con Vite en producción
    global: 'window',
  },
});
