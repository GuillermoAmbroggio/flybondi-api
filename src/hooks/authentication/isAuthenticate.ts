import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const isAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  const { SECRET_JWT, X_API_KEY_APP, X_API_KEY_WEB } = process.env;
  const authHeader = req.headers.authorization;
  const authX_Api_Key = req.headers['x-api-key'];
  const isApp = authX_Api_Key === X_API_KEY_APP;
  if (authX_Api_Key === X_API_KEY_APP || authX_Api_Key === X_API_KEY_WEB) {
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (SECRET_JWT && isApp) {
        // <---Autenticacion mediante tokens--->
        jwt.verify(token, SECRET_JWT, (err, user: any) => {
          if (err) {
            return res.status(403).send('The access token expired.');
          }
          if (user) {
            req.session.user = user;
            return next();
          }
        });
      } else if (req.session.user) {
        // <---Autenticacion mediante cookies--->
        if (req.session.user.csrf === token) {
          return next();
        } else {
          return res.status(403).send('The access token invalid.');
        }
      } else if (!SECRET_JWT) {
        // <---Si no existe el Secret JWT en API--->
        return res.status(401).send('Api error, does not exist secretJWT');
      } else {
        // <---Si no existe ninguna sesion--->
        return res.status(401).send('Session expired.');
      }
    } else {
      return res.status(401).send('There is no authorization token.');
    }
  } else {
    return res.status(400).send('The api key code is incorrect.');
  }
};

export default isAuthenticate;
