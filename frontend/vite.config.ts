
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load root .env
dotenv.config({ path: resolve(__dirname, '../.env') })

// https://vitejs.dev/config/

const frontendPort = Number(process.env.FRONTEND_PORT);

export default defineConfig({
  plugins: [react()],
  server: {
    port: frontendPort,
    host: true
  }
})