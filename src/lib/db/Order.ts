import sequelize from './sequelize'
import { DataTypes, Model } from 'sequelize'
import ulid from '$lib/ulid'
import orderStatuses from '$lib/config/order.status'
import User from './User'
import Account from './Account'
import OrderItem from './OrderItem'
import BadOrderItem from './BadOrderItem'

const attributes = {
    id: {
        type: DataTypes.STRING(26),
        primaryKey: true,
        defaultValue: ulid.generate,
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
    accountId: {
        type: DataTypes.STRING(26),
        field: 'account_id',
        allowNull: false,
        validate: {
            isValid: ulid.validator()
           }
       },
    orderDate: {
        type: DataTypes.DATEONLY,
        field: 'order_date',
        allowNull: false
        },
    expectedDeliveryDate: {
        type: DataTypes.DATEONLY,
        field: 'expected_delivery_date'
        },
    receivedDeliveryDate: {
        type: DataTypes.DATEONLY,
        field: 'received_delivery_date'
        },
    updatedBy: {
        type: DataTypes.STRING(26),
        field: 'updated_by',
        validate: {
            isValid: ulid.validator(true)
           }
        },
    status: DataTypes.ENUM(
        orderStatuses.PENDING,
        orderStatuses.CONFIRMED,
        orderStatuses.PROCESSING,
        orderStatuses.DELIVERED,
        orderStatuses.CANCELLED
        ),
    totalPrice: {
        type: DataTypes.DECIMAL(12, 2),
        field: 'total_price',
        allowNull: false
        }
}

const options = {
    sequelize,
    freezeTableName: true,
    tableName: 'order',
    timestamps: true
}

class Order extends Model {
    declare id: string
    declare userId: string
    declare accountId: string
    declare orderDate: string
    declare expectedDeliveryDate: string | null
    declare receivedDeliveryDate: string | null
    declare updatedBy: string | null
    declare status: string
    declare totalPrice: number
    declare user?: User
    declare account?: Account
    declare orderItems?: OrderItem[]
    declare badOrderItems?: BadOrderItem[]

    static associate(models: Json) {
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId'
           })

        this.belongsTo(models.Account, {
            as: 'account',
            foreignKey: 'accountId'
           })

        this.hasMany(models.OrderItem, {
            as: 'orderItems',
            foreignKey: 'orderId'
           })

        this.hasMany(models.BadOrderItem, {
            as: 'badOrderItems',
            foreignKey: 'orderId'
           })
       }
}

Order.init(attributes, options)

export default Order
