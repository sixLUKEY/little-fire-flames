// import { Sequelize } from "sequelize";
// import { SequelizeConfig } from "./types";
//
// const env = process.env.ENV === 'production' ? 'production' : 'development'
//
// const config: SequelizeConfig = {
//   database: process.env.DB_NAME ?? '',
//   host: process.env.HOST ?? '',
//   env,
//   dialect: 'postgres',
//   password: '',
//   port: 8080,
//   username: '',
// }
// export const sequelize = new Sequelize(config)

import { Sequelize } from 'sequelize';
import { SequelizeConfig } from './types';

const env = process.env.ENV === 'production' ? 'production' : 'development';

const config: SequelizeConfig = {
  database: process.env.DB_NAME || process.env.POSTGRES_DB || 'myapp',
  host: process.env.HOST || process.env.DB_HOST || 'localhost',
  env,
  dialect: 'postgres',
  password:
    process.env.DB_PASSWORD ||
    process.env.POSTGRES_PASSWORD ||
    'myapp_password',
  port: parseInt(process.env.DB_PORT || process.env.POSTGRES_PORT || '5432'),
  username: process.env.DB_USER || process.env.POSTGRES_USER || 'myapp_user',
  logging: env === 'development' ? console.log : false,
};

export const sequelize = new Sequelize(config);
