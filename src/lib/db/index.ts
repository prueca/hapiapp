import { DB_FORCE } from '$env/static/private'
import _ from 'lodash'
import sequelize from './sequelize'
import User from './User'
import Account from './Account'
import Access from './Access'

const models = {
    User,
    Account,
    Access
}

type ModelWithAssociate = {
    associate?: (arg: typeof models) => void
}

_.values(models).map((model) => {
    let assoc = (model as typeof model & ModelWithAssociate).associate

    if (typeof assoc !== 'function') {
        return
    }

    assoc = assoc.bind(model)
    assoc(models)
})

sequelize
    .authenticate()
    .then(() => {
        console.log('DB connection has been established successfully.')

        return sequelize.sync({
            force: DB_FORCE === '1'
        })
    })
    .catch((error: Error) => {
        console.error('Unable to connect to the database:', error)
    })

export { sequelize }
export default models
