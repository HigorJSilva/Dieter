import { Sequelize } from "sequelize";
import dotenv from 'dotenv'

dotenv.config()

export const database = new Sequelize( 
    <string>process.env.DATABASE,
    <string>process.env.DB_USER,
    <string>process.env.DB_PASSWORD,
    {
        define: {
            timestamps: false
          },
        dialect: 'mariadb', 
        host: 'localhost',
        logging: false
});

