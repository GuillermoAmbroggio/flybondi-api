declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: 'development' | 'production';
      DEV_DB_USER: string;
      DEV_DB_PASSWORD: string;
      DEV_DB_HOST: string;
      DEV_DB_NAME: string;
      DEV_URL_DATABASE: string;
      PORT: string;
      SESSION_SECRET1: string;
      SESSION_SECRET2: string;
      SECRET_KEY_ADMIN_CREATE: string;
      SECRET_JWT: string;
      SECRET_JWT_REFRESH: string;
      API_URL_DEV: string;
      X_API_KEY_WEB: string;
      CLIENT_URL: string;
    }
  }
}

export {};
