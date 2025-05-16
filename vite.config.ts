import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Important: base must match your GitHub repo name!
  base: '/aso-backend-ui/', // <-- CHANGE THIS if your repo name changes
})
