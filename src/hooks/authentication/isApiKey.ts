import { Request, Response, NextFunction } from 'express';

const isApiKey = (req: Request, res: Response, next: NextFunction) => {
  const { X_API_KEY_APP, X_API_KEY_WEB } = process.env;
  const authX_Api_Key = req.headers['x-api-key'];
  if (authX_Api_Key === X_API_KEY_APP || authX_Api_Key === X_API_KEY_WEB) {
    next();
  } else {
    res.status(400).send('The api key code is invalid');
  }
};

export default isApiKey;
