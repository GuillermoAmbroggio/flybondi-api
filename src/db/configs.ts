import dotenv from 'dotenv';
dotenv.config();

const { DEV_DB_NAME, DEV_DB_USER, DEV_DB_PASSWORD, DEV_DB_HOST } = process.env;

type IConfigs = {
  database?: string;
  username?: string;
  password?: string;
  host?: string;
};

const configDB = () => {
  let configs: IConfigs | {} = {};
  configs = {
    database: DEV_DB_NAME,
    username: DEV_DB_USER,
    password: DEV_DB_PASSWORD,
    host: DEV_DB_HOST,
  };

  return configs;
};

export default configDB;
