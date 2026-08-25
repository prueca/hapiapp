import sequelize from './sequelize'
import { DataTypes, Model } from 'sequelize'
import ulid from '$lib/ulid'
import productCategories from '$lib/config/product.category'
import productPackagings from '$lib/config/product.packaging'
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
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
       },
    description: {
        type: DataTypes.STRING(255)
       },
    category: {
        type: DataTypes.ENUM(
            productCategories.COMBINATION_PACKS,
            productCategories.LIMITED_EDITION,
            productCategories.MULTI_SERVE_TUBS,
            productCategories.PREMIUM_NOVELTIES,
            productCategories.SINGLE_SERVE_NOVELTIES,
            productCategories.SPECIALTY_TUBS
          )
       },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
       },
    currency: {
        type: DataTypes.STRING(3),
        allowNull: false
       },
    sizeValue: {
        type: DataTypes.STRING(20),
        field: 'size_value'
       },
    sizeUnit: {
        type: DataTypes.STRING(20),
        field: 'size_unit'
       },
    packaging: {
        type: DataTypes.ENUM(
            productPackagings.BOX,
            productPackagings.CONE,
            productPackagings.CUP,
            productPackagings.GALLON,
            productPackagings.PINT,
            productPackagings.STICK,
            productPackagings.TUB
          )
       },
    status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1
       },
    enlisted: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1
       }
}

const options = {
    sequelize,
    freezeTableName: true,
    tableName: 'product',
    timestamps: true
}

class Product extends Model {
    declare id: string
    declare name: string
    declare description: string | null
    declare category: string
    declare price: number
    declare currency: string
    declare sizeValue: string | null
    declare sizeUnit: string | null
    declare packaging: string
    declare status: number
    declare enlisted: number
    declare orderItems?: OrderItem[]
    declare badOrderItems?: BadOrderItem[]

    static associate(models: Json) {
        this.hasMany(models.OrderItem, {
            as: 'orderItems',
            foreignKey: 'productId'
          })

        this.hasMany(models.BadOrderItem, {
            as: 'badOrderItems',
            foreignKey: 'productId'
          })
      }
}

Product.init(attributes, options)

export default Product
