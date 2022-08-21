import { Sequelize } from 'sequelize-typescript';
import configs from './configs';
import { InvalidTokens, Users, Trips, Orders } from '../models';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  ...configs(),
});

sequelize.addModels([Users, InvalidTokens, Trips, Orders]);

InvalidTokens.beforeCreate(async () => {
  /** Elimina Refresh token de usuarios deslogueados cuando expiren. */
  const deleteInvalidTokens =
    'DELETE FROM "InvalidTokens" WHERE "expiredDate" < NOW()';
  sequelize.query(deleteInvalidTokens);
});

/** Crea la tabla de sesión para utilizar con cookies */
const createTableSession = `
DROP TABLE IF EXISTS "session" CASCADE;
CREATE TABLE IF NOT EXISTS "session" ("sid" varchar NOT NULL COLLATE "default","sess" json NOT NULL,"expire" timestamp(6) NOT NULL)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "session" ("expire");`;
const isTableSession = `SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE  table_schema = 'public'
   AND    table_name   = 'session'
   );`;

const deleteRowSession = `
CREATE OR REPLACE FUNCTION expire_table_delete_old_rows() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM session WHERE expire < NOW();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS expire_table_delete_old_rows_trigger on public.session;
CREATE TRIGGER expire_table_delete_old_rows_trigger
    AFTER INSERT ON session
    EXECUTE PROCEDURE expire_table_delete_old_rows();`;

sequelize.query(deleteRowSession);

process.env.ENV === 'development'
  ? sequelize.query(createTableSession)
  : sequelize.query(isTableSession).then((data: any) => {
      if (!data[0][0].exists) {
        sequelize.query(createTableSession);
      }
    });
