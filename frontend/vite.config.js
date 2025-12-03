import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(),
    tailwindcss()
    ],
    server: {
      port: parseInt(env.VITE_PORT) || 5173, //  Safe access
    },
  }
})
