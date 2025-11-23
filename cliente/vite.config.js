import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    cors: true,
    hmr: {
      clientPort: 5174
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    allowedHosts: [
      '5174-i755hcd1buuaeiedddjls-803a3e12.manusvm.computer',
      '8000-i755hcd1buuaeiedddjls-803a3e12.manusvm.computer',
      '5174-i3tr3wv1jbd9393qvuqvg-803a3e12.manusvm.computer',
      '5174-idnmjmtc728l8uto4ygj7-a5774e10.manusvm.computer'
    ],
  },
})
