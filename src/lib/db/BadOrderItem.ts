import sequelize from './sequelize'
import { DataTypes, Model } from 'sequelize'
import ulid from '$lib/ulid'
import Order from './Order'
import Product from './Product'

const attributes = {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
        },
    orderId: {
        type: DataTypes.STRING(26),
        field: 'order_id',
        allowNull: false,
        validate: {
            isValid: ulid.validator()
            }
        },
    productId: {
        type: DataTypes.STRING(26),
        field: 'product_id',
        allowNull: false,
        validate: {
            isValid: ulid.validator()
            }
        },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isPositive: true
            }
        },
    unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'unit_price',
        allowNull: false
         },
    totalPrice: {
        type: DataTypes.DECIMAL(12, 2),
        field: 'total_price',
        allowNull: false
         },
    status: DataTypes.ENUM('pending', 'deducted')
}

const options = {
    sequelize,
    freezeTableName: true,
    tableName: 'bad_order_item',
    timestamps: true
}

class BadOrderItem extends Model {
    declare id: bigint
    declare orderId: string
    declare productId: string
    declare quantity: number
    declare unitPrice: number
    declare totalPrice: number
    declare status: string
    declare order?: Order
    declare product?: Product

    static associate(models: Json) {
        this.belongsTo(models.Order, {
            as: 'order',
            foreignKey: 'orderId'
            })

        this.belongsTo(models.Product, {
            as: 'product',
            foreignKey: 'productId'
            })
        }
}

BadOrderItem.init(attributes, options)

export default BadOrderItem
