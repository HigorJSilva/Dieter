import { InferAttributes, InferCreationAttributes, Model, DataTypes } from 'sequelize';
import { database } from '../config/database'; 
import { User } from './User';

export interface IPropertyCrud extends Model<IPropertyCrud>{
    user: {id: DataTypes.BigIntDataType},
}

export interface IProperty extends Model<InferAttributes<IProperty> , InferCreationAttributes<IPropertyCrud>>{
    id: DataTypes.BigIntDataType, 
    userId: DataTypes.BigIntDataType,
    name: DataTypes.StringDataType, 
    address?: DataTypes.StringDataType, 
    waterCompanyId?: DataTypes.StringDataType,
    electricityCompanyId?: DataTypes.StringDataType,
}

export const Property = database.define('property', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        userId:{
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
        },
        waterCompanyId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        electricityCompanyId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }
);
Property.belongsTo(User, {
    foreignKey: 'userId'
});