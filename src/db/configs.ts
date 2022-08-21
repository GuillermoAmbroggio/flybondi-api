import dotenv from 'dotenv';
dotenv.config();

const {
  ENV,
  DEV_DB_NAME,
  DEV_DB_USER,
  DEV_DB_PASSWORD,
  DEV_DB_HOST,
  PROD_DB_NAME,
} = process.env;

type IConfigs = {
  database?: string;
  username?: string;
  password?: string;
  host?: string;
};

const configDB = () => {
  let configs: IConfigs | {} = {};
  if (ENV === 'development') {
    configs = {
      database: DEV_DB_NAME,
      username: DEV_DB_USER,
      password: DEV_DB_PASSWORD,
      host: DEV_DB_HOST,
    };
  } else {
    configs = { database: PROD_DB_NAME };
  }
  return configs;
};

export default configDB;
