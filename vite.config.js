import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vitest reads this same file, so tests build JSX exactly like the app does
  test: {
    // A fake browser (document, localStorage...) inside Node
    environment: 'jsdom',
    // Runs before every test file
    setupFiles: './src/test/setup.js',
  },
})
