import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Replace 'blumeltoken.github.io' with your actual repository name 
  // if it is different from your username. 
  // If your repo is exactly 'blumeltoken.github.io', use '/'
  base: '/', 
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
    strictPort: true,
    // This is to enable WebSocket connections for HMR in cloud IDEs
    hmr: {
      protocol: 'wss',
      port: 443
    }
  }
})
