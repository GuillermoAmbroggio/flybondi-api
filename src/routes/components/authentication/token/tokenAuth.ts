import { Router, Request } from 'express';
import { comparePassword } from '../../../../hooks/authentication/useHashPassword';
import { TLogin } from '../authentication.types';
import jwt from 'jsonwebtoken';
import { InvalidTokens, Users } from '../../../../models';
import isApiKey from '../../../../hooks/authentication/isApiKey';
import dotenv from 'dotenv';
dotenv.config();

const tokenAuth = Router();
const { SECRET_JWT, SECRET_JWT_REFRESH } = process.env;

// <---Loguea un usuario mediante token--->
tokenAuth.post(
  '/login-token',
  isApiKey,
  async (req: Request<{}, {}, TLogin>, res) => {
    const { email, password } = req.body;
    Users.findAll({
      where: { email: email.toLocaleLowerCase() },
    }).then((data) => {
      if (data.length) {
        comparePassword(password, data[0].password).then((isCorrect) => {
          if (isCorrect) {
            // Generate an access token & refresh access token
            if (SECRET_JWT && SECRET_JWT_REFRESH) {
              const accessToken = jwt.sign(
                { id: data[0].id, role: data[0].role },
                SECRET_JWT,
                { expiresIn: '1d' },
              );
              const refreshToken = jwt.sign(
                { id: data[0].id, role: data[0].role },
                SECRET_JWT_REFRESH,
                { expiresIn: '30d' },
              );
              res.send({
                accessToken: accessToken,
                refreshToken: refreshToken,
              });
            } else {
              res.status(400).send('Api error, does not exist secretJWT');
            }
          } else {
            res.status(401).send('Contraseña incorrecta');
          }
        });
      } else {
        res.status(401).send('El correo es incorrecto o no existe');
      }
    });
  },
);

// <---Actualiza el token de acceso--->
tokenAuth.post(
  '/refresh-token',
  isApiKey,
  async (req: Request<{}, {}, { token: string }>, res) => {
    const { token } = req.body;
    if (!token) {
      return res.status(401).send('The refresh access token does not exist');
    }

    InvalidTokens.findOne({ where: { invalidToken: token } })
      .then((tokenInvalid) => {
        if (tokenInvalid) {
          return res.status(403).send('The refresh access token expired');
        } else {
          if (SECRET_JWT && SECRET_JWT_REFRESH) {
            jwt.verify(token, SECRET_JWT_REFRESH, (err, user: any) => {
              if (err) {
                return res.status(404).send('The refresh access token expired');
              }
              const newToken = jwt.sign(
                { id: user.id, role: user.role },
                SECRET_JWT,
                { expiresIn: '1d' },
              );
              res.send({ accessToken: newToken });
            });
          } else {
            res.status(404).send('Api error, does not exist secretRefreshJWT');
          }
        }
      })
      .catch((e) => res.send(e));
  },
);

// <---Desloguea al usuario y elimina el refresh token--->
tokenAuth.post('/logout-token', isApiKey, async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken) {
    const dateExpired = new Date();

    //30 dias para que expire el token.
    dateExpired.setDate(dateExpired.getDate() + 30);

    InvalidTokens.create({
      invalidToken: refreshToken,
      expiredDate: dateExpired,
    })
      .then(() => {
        res.send('User disconnected');
      })
      .catch((e) => {
        res.status(400).send(e);
      });
  } else {
    res.status(404).send('It is necessary to send the refresh token by body');
  }
});

export default tokenAuth;
