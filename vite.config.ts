// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // ¡DEBE coincidir con el nombre de tu repositorio: japanece-practice!
  base: '/japanece-practice/', 
  plugins: [react()],
})