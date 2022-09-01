/* eslint-disable @typescript-eslint/no-var-requires */
import express, { Application, Request, Response, NextFunction } from 'express';
import routes from './routes';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const pg = require('pg');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const favicon = require('serve-favicon');

const {
  ENV,
  DEV_URL_DATABASE,
  SESSION_SECRET1,
  SESSION_SECRET2,
  API_URL_DEV,
  X_API_KEY_WEB,
  CLIENT_URL,
} = process.env;
const app: Application = express();
const sessionDBaccess = new pg.Pool(
  ENV === 'development'
    ? {
        connectionString: DEV_URL_DATABASE,
      }
    : {
        connectionString: DEV_URL_DATABASE,
        ssl: { rejectUnauthorized: false },
      },
);

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins: string[] = [CLIENT_URL];
  const origin: string = req.headers.origin || '';

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization,X-Api-Key',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(
  session({
    store: new pgSession({
      pool: sessionDBaccess,
      tableName: 'session',
    }),
    secret: [SESSION_SECRET1, SESSION_SECRET2],
    resave: ENV === 'production' ? true : false,
    saveUninitialized: false,
    pruneSessionInterval: 60,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  }),
);

app.use('/', routes);

/** Insertar favicon */
app.use(favicon(path.join('favicon.ico')));

/** Permite acceder publicamente a las imagenes de assets */
app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
  if (req.session.user && req.session.user.role !== 'client') {
    res.redirect('/home/docs');
  } else {
    res.render('login', { apiUrl: API_URL_DEV, apiKey: X_API_KEY_WEB });
  }
});

export default app;
