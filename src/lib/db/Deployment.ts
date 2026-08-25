import sequelize from './sequelize'
import { DataTypes, Model } from 'sequelize'
import ulid from '$lib/ulid'
import deploymentStatuses from '$lib/config/deployment.status'
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
        deploymentStatuses.DEPLOYMENT,
        deploymentStatuses.FOR_DOWNGRADE,
        deploymentStatuses.FOR_PULLOUT,
        deploymentStatuses.FOR_REPLACEMENT,
        deploymentStatuses.FOR_UPGRADE,
        deploymentStatuses.PULLOUT_BY_DEALER,
        deploymentStatuses.PULLOUT_BY_DISTRIBUTOR
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
        }
}

const options = {
    sequelize,
    freezeTableName: true,
    tableName: 'deployment',
    timestamps: true
}

class Deployment extends Model {
    declare id: string
    declare status: string
    declare freezerId: string
    declare accountId: string
    declare userId: string
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

Deployment.init(attributes, options)

export default Deployment
