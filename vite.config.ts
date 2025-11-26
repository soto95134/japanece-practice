// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Utiliza la variable de entorno VITE_BASE_PATH si existe, sino usa la raíz
const BASE_PATH = process.env.VITE_BASE_PATH || '/'; 

export default defineConfig({
  // Asignamos la variable BASE_PATH, que será la ruta del repo si se ejecuta desde GitHub Actions
  base: BASE_PATH, 
  plugins: [react()],
})