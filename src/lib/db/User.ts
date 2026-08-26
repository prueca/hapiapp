import sequelize from './sequelize'
import { DataTypes, Model } from 'sequelize'
import ulid from '$lib/ulid'
import userRoles from '$lib/config/user.roles'
import Account from './Account'

const attributes = {
    id: {
        type: DataTypes.STRING(26),
        primaryKey: true,
        defaultValue: ulid.generate,
        validate: {
            isValid: ulid.validator()
        }
    },
    role: DataTypes.ENUM(
        userRoles.DISTRIBUTOR_ADMIN,
        userRoles.DISTRIBUTOR_USER,
        userRoles.DEALER_ADMIN,
        userRoles.DEALER_USER,
        userRoles.FRANCHISEE_ADMIN,
        userRoles.FRANCHISEE_USER
    ),
    firstName: {
        type: DataTypes.STRING(100),
        field: 'first_name'
    },
    middleName: {
        type: DataTypes.STRING(100),
        field: 'middle_name'
    },
    lastName: {
        type: DataTypes.STRING(100),
        field: 'last_name'
    },
    address: {
        type: DataTypes.TEXT
    },
    phone: {
        type: DataTypes.STRING(32)
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}

const options = {
    sequelize,
    freezeTableName: true,
    tableName: 'user',
    timestamps: true
}

class User extends Model {
    declare id: string
    declare role: string
    declare firstName: string | null
    declare middleName: string | null
    declare lastName: string | null
    declare address: string | null
    declare phoneNo: string | null
    declare username: string
    declare password: string
    declare status: string
}

User.init(attributes, options)

export default User
