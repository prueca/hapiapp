import dotenv from 'dotenv'
import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

dotenv.config({ override: true })

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    server: {
        host: true, // 0.0.0.0 — accessible from local network
        strictPort: true, // use the exact port, won't auto-increment
        https: {
            key: fs.readFileSync(path.resolve(__dirname, String(process.env.TLS_KEY_PATH))),
            cert: fs.readFileSync(path.resolve(__dirname, String(process.env.TLS_CERT_PATH)))
        }
    }
})
