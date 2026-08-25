import sequelize from './sequelize'
import { DataTypes, Model } from 'sequelize'
import ulid from '$lib/ulid'
import Deployment from './Deployment'
import Cabcon from './Cabcon'

const attributes = {
    id: {
        type: DataTypes.STRING(26),
        primaryKey: true,
        defaultValue: ulid.generate,
        validate: {
            isValid: ulid.validator()
          }
      },
    model: {
        type: DataTypes.STRING(100),
        allowNull: false
       },
    capacity: {
        type: DataTypes.STRING(20)
       },
    barcode: {
        type: DataTypes.STRING(40)
       },
    brand: {
        type: DataTypes.STRING(50)
       },
    yearModel: {
        type: DataTypes.INTEGER,
        field: 'year_model'
       }
}

const options = {
    sequelize,
    freezeTableName: true,
    tableName: 'freezer',
    timestamps: true
}

class Freezer extends Model {
    declare id: string
    declare model: string
    declare capacity: string | null
    declare barcode: string | null
    declare brand: string | null
    declare yearModel: number | null
    declare deployments?: Deployment[]
    declare cabcons?: Cabcon[]

    static associate(models: Json) {
        this.hasMany(models.Deployment, {
            as: 'deployments',
            foreignKey: 'freezerId'
          })

        this.hasMany(models.Cabcon, {
            as: 'cabcons',
            foreignKey: 'freezerId'
          })
      }
}

Freezer.init(attributes, options)

export default Freezer
