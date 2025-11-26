// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 💡 USAR RUTA RELATIVA: Esto hace que las referencias en el HTML sean relativas (ej. ./assets/archivo.js)
  // ESTO IGNORA el nombre exacto del repositorio y funciona siempre.
  base: './', 
  plugins: [react()],
})