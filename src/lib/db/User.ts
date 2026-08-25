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
    phoneNo: {
        type: DataTypes.STRING(32),
        field: 'phone_no'
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
    accountId: {
        type: DataTypes.STRING(26),
        field: 'account_id',
        allowNull: false,
        validate: {
            isValid: ulid.validator()
          }
      },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'active'
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
    declare accountId: string
    declare status: string
    declare account?: Account

    static associate(models: Json) {
        this.belongsTo(models.Account, {
            as: 'account',
            foreignKey: 'accountId'
          })
      }
}

User.init(attributes, options)

export default User
