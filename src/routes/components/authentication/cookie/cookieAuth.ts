import { Router } from 'express';
import { Request } from 'express';
import { TLogin } from '../authentication.types';
import { comparePassword } from '../../../../hooks/authentication/useHashPassword';
import { randomBytes } from 'crypto';
import { Users } from '../../../../models';
import isApiKey from '../../../../hooks/authentication/isApiKey';

declare module 'express-session' {
  interface Session {
    user: { id: number; role: 'client' | 'admin' | 'developer'; csrf: string };
  }
}

const cookieAuth = Router();

// <---Loguea usuario en la api web--->
cookieAuth.post(
  '/login-api',
  isApiKey,
  async (req: Request<any, any, TLogin>, res) => {
    const { email, password } = req.body;
    const { X_API_KEY_WEB } = process.env;
    if (X_API_KEY_WEB === req.headers['x-api-key']) {
      Users.findAll({
        where: { email: email.toLocaleLowerCase() },
      }).then((data) => {
        if (data.length) {
          comparePassword(password, data[0].password).then((isCorrect) => {
            if (isCorrect) {
              if (data[0].role === 'client') {
                res
                  .status(401)
                  .send(
                    'You do not have the permissions to access this content',
                  );
              } else {
                req.session.user = {
                  id: data[0].id,
                  role: data[0].role,
                  csrf: 'Login-Api',
                };
                console.log('########### COOCKIE AUTH 43', {
                  reqSession: req.session,
                });
                res.sendStatus(200);
              }
            } else {
              res.status(401).send('The password is incorrect');
            }
          });
        } else {
          res.status(401).send('The email does not exist');
        }
      });
    } else {
      res.status(400).send('The api key code is incorrect');
    }
  },
);

// <---Loguea un usuario en la client web--->
cookieAuth.post(
  '/login',
  isApiKey,
  async (req: Request<any, any, TLogin>, res) => {
    const { email, password } = req.body;
    const { X_API_KEY_WEB } = process.env;
    if (X_API_KEY_WEB === req.headers['x-api-key']) {
      Users.findAll({
        where: { email: email.toLocaleLowerCase() },
      }).then((data) => {
        if (data.length) {
          comparePassword(password, data[0].password).then((isCorrect) => {
            if (isCorrect) {
              const csrfToken = randomBytes(100).toString('base64');
              req.session.user = {
                id: data[0].id,
                role: data[0].role,
                csrf: csrfToken,
              };
              res.send({ csrfToken: csrfToken });
            } else {
              res.status(401).send('La contraseña es incorrecta');
            }
          });
        } else {
          res.status(401).send('El correo es incorrecto o no existe');
        }
      });
    } else {
      res.status(400).send('The api key code is incorrect');
    }
  },
);

// <---Desloguea un usuario de la web--->
cookieAuth.get('/logout', isApiKey, async (req, res) => {
  req.session.destroy(() => res.send('User disconnected'));
});

export default cookieAuth;
