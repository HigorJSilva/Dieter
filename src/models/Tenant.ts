import { InferAttributes, InferCreationAttributes, Model, DataTypes } from 'sequelize';
import { database } from '../config/database'; 
import { User } from './User';

export interface ITenantCrud extends Model<ITenantCrud>{
    user: {id: DataTypes.BigIntDataType},
}

export interface ITenant extends Model<InferAttributes<ITenant> , InferCreationAttributes<ITenantCrud>>{
    id: DataTypes.BigIntDataType, 
    userId: DataTypes.BigIntDataType,
    name: DataTypes.StringDataType, 
    email?: DataTypes.StringDataType,
    phone?: DataTypes.StringDataType,
}

export const Tenant = database.define('tenant', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        userId:{
            type: DataTypes.BIGINT,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate:{
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }
);
Tenant.belongsTo(User, {
    foreignKey: 'userId'
});