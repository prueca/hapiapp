import { DB_URL, DB_SSL } from '$env/static/private'
import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(DB_URL as string, {
    dialect: 'postgres',
    define: {
        underscored: true
    },
    logging: false,
    dialectOptions: {
        ssl: DB_SSL === '1' ? { require: true, rejectUnauthorized: false } : false
    }
})

export default sequelize
