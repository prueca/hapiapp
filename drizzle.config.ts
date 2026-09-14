/// <reference types="node" />

import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    dialect: 'postgresql',
    schema: ['./src/lib/drizzle/schema/**/*.ts'],
    out: './drizzle',
    dbCredentials: {
        url: process.env.DB_URL!
    }
})
