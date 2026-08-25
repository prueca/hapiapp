import sequelize from './sequelize'
import { DataTypes, Model } from 'sequelize'
import ulid from '$lib/ulid'
import cabconStatuses from '$lib/config/cabcon.status'
import Freezer from './Freezer'
import Account from './Account'
import User from './User'

const attributes = {
    id: {
        type: DataTypes.STRING(26),
        primaryKey: true,
        defaultValue: ulid.generate,
        validate: {
            isValid: ulid.validator()
            }
        },
    status: DataTypes.ENUM(
        cabconStatuses.MANUAL_SUBMIT,
        cabconStatuses.MATCHED,
        cabconStatuses.MISMATCH
         ),
    freezerId: {
        type: DataTypes.STRING(26),
        field: 'freezer_id',
        allowNull: false,
        validate: {
            isValid: ulid.validator()
            }
        },
    accountId: {
        type: DataTypes.STRING(26),
        field: 'account_id',
        allowNull: false,
        validate: {
            isValid: ulid.validator()
            }
        },
    userId: {
        type: DataTypes.STRING(26),
        field: 'user_id',
        allowNull: false,
        validate: {
            isValid: ulid.validator()
            }
        },
    image: {
        type: DataTypes.TEXT
        }
}

const options = {
    sequelize,
    freezeTableName: true,
    tableName: 'cabcon',
    timestamps: true
}

class Cabcon extends Model {
    declare id: string
    declare status: string
    declare freezerId: string
    declare accountId: string
    declare userId: string
    declare image: string | null
    declare freezer?: Freezer
    declare account?: Account
    declare user?: User

    static associate(models: Json) {
        this.belongsTo(models.Freezer, {
            as: 'freezer',
            foreignKey: 'freezerId'
            })

        this.belongsTo(models.Account, {
            as: 'account',
            foreignKey: 'accountId'
            })

        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId'
            })
        }
}

Cabcon.init(attributes, options)

export default Cabcon
