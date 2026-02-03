export type SequelizeConfig = {
  /** Database name */
  database: string;

  /** Database user */
  username: string;

  /** Database password */
  password: string;

  /** PostgreSQL host */
  host: string;

  /** PostgreSQL port */
  port: number;

  /** Sequelize dialect */
  dialect: 'postgres';

  /** Enable/disable SQL logging */
  logging?: boolean | ((sql: string) => void);

  /** Connection pool configuration */
  pool?: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };

  /** SSL configuration (e.g. RDS) */
  // ssl?: {
  //   require: boolean;
  //   rejectUnauthorized: boolean;
  // };

  /** Optional schema name */
  schema?: string;

  /** Application environment */
  env?: 'development' | 'test' | 'production';
};
