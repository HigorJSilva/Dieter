import { Sequelize } from "sequelize";
import dotenv from 'dotenv'
import { Op } from "sequelize";

dotenv.config()

const operatorsAliases = {
    $or: Op.or,
    $like: Op.like,
  };
  

export const database = new Sequelize( 
    <string>process.env.DATABASE,
    <string>process.env.DB_USER,
    <string>process.env.DB_PASSWORD,
    {
        operatorsAliases,
        define: {
            timestamps: false
        },
        dialect: 'mariadb', 
        host: 'localhost',
        logging: false
});

