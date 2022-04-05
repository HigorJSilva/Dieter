import { InferAttributes, InferCreationAttributes, Model, DataTypes } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { database } from '../config/database'; 

export interface IUser extends Model<InferAttributes<IUser> , InferCreationAttributes<IUser>>{
    id: DataTypes.BigIntDataType, 
    email: DataTypes.StringDataType,
    password: DataTypes.StringDataType, 
}

export const User = database.define('user', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value: string) {
            this.setDataValue('password', bcrypt.hashSync(value,10));
        },
    },
})