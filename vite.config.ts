import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // ¡DEBE ser el nombre exacto de tu repositorio, rodeado de barras!
  base: '/japanese-practice/', 
  plugins: [react()],
})