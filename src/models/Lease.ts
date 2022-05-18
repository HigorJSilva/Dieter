import { InferAttributes, InferCreationAttributes, Model, DataTypes } from 'sequelize';
import { database } from '../config/database'; 
import { Property } from './Property';
import { Tenant } from './Tenant';
import { User } from './User';

export interface ILeaseCrud extends Model<ILeaseCrud>{
    user: {id: DataTypes.BigIntDataType},
}

export interface ILease extends Model<InferAttributes<ILease> , InferCreationAttributes<ILeaseCrud>>{
    id: DataTypes.BigIntDataType, 
    userId: DataTypes.BigIntDataType,
    propertyId: DataTypes.BigIntDataType,
    tenantId: DataTypes.BigIntDataType,
    value: DataTypes.StringDataType, 
    startDate?: DataTypes.DateDataType, 
    endDate?: DataTypes.StringDataType,
    paymentFrequency: DataTypes.IntegerDataType,
    active: Boolean,
}

export const Lease = database.define('lease', {
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
        propertyId:{
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        tenantId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        value: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        paymentFrequency: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    }
);
Lease.belongsTo(User, {
    foreignKey: 'userId'
});

Lease.belongsTo(Property, {
    foreignKey: 'propertyId'
});

Lease.belongsTo(Tenant, {
    foreignKey: 'tenantId'
});