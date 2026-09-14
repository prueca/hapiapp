import { DB_URL } from '$env/static/private'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schema'
import { accountRelation, freezerRelations } from './relations'

const pool = new Pool({
    connectionString: DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

const db = drizzle(pool, {
    schema: {
        ...schema,
        accountRelation,
        freezerRelations
    }
})

const authenticate = async () => {
    try {
        await db.execute('SELECT 1')
        console.log('Database connection established.')
    } catch (e: any) {
        console.log(`Error connecting to database: ${e.message}`)
        console.log(e.stack)
    }
}

authenticate()

export default db
