/* eslint-disable @typescript-eslint/no-var-requires */
import express, { Application, Request, Response, NextFunction } from 'express';
import isAuthenticate from './hooks/authentication/isAuthenticate';
import routes from './routes';
import dotenv from 'dotenv';
dotenv.config();

const pg = require('pg');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const { ENV, DEV_URL_DATABASE, SESSION_SECRET1, SESSION_SECRET2 } = process.env;
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
  const allowedOrigins: string[] = [
    'http://localhost:3000',
    'http://192.168.0.10:3000',
    'http://192.168.0.53:3000',
  ];
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
    resave: false,
    saveUninitialized: false,
    pruneSessionInterval: 60,
    cookie: {
      maxAge: 60000 * 60, // 60000 = 60 seg = 1 min
      secure: ENV === 'production' ? true : false,
      httpOnly: true,
    },
  }),
);

app.use('/', routes);

app.get('/', async (req: express.Request, res, next) => {
  if (req.session.user && req.session.user.role !== 'client') {
    res.redirect('/home/docs');
  } else {
    res.render('login');
  }
});

app.get('/pruebas', isAuthenticate, async (req, res, next) => {
  const idUser = req.session.user.id;
  if (idUser) {
    return res.json({ idUser });
  }
  return res.status(404).send('User not found');
});

app.use(
  (
    err: { status: number; message: string },
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const status = err.status || 500;
    const message = err.message || err;
    console.error(err);
    res.status(status).send(message);
  },
);

export default app;
