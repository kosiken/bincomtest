/* tslint:disable:no-var-requires */
import { IConfig } from './interface';

export const defaultConfig: IConfig = {
  serverPort: process.env.SERVER_PORT!,
  env: process.env.NODE_ENV!,
  version: '1.0.0',
  db: {
    user: process.env.DB_USER!,
    port: process.env.DB_PORT!,
    dbName: process.env.DB_NAME!,
    dbHost: process.env.DB_HOST!,
    password: process.env.DB_PASSWORD!,
  },
 };
