import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite build config for the static AESA site. base "/" matches the custom domain aesa.site.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
