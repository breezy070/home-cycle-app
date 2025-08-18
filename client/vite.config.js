import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target : 'http://localhost:3000',
        secure: false,
      }
    }
  },
  alias: {
      '@': path.resolve(__dirname, './src'), // 👈 maps @ to /src
  },
})
