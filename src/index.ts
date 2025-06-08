import 'dotenv-safe/config';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { connectToDB, runMigrations, startCronJobs, startMoralis } from './init';

import AppConfig from './config';
import AppEndpoints from './api';

if (process.env.NODE_ENV !== 'development') {
  import('module-alias/register').catch((e) => {
    AppConfig.Logger.error('Error while registering module-alias', e);
  });
}

const boot = async () => {
  await connectToDB();
  await startMoralis();
  if (process.env.NODE_ENV === 'production') {
    await startCronJobs();
  }
  await runMigrations();

  const app = express();
  app.disable('x-powered-by');
  app.use(AppConfig.MiddleWare.allowedMethods);
  app.use(
    cors({
      credentials: true,
      origin: process.env.FRONTEND_URL,
    }),
  );
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.get('/', (_, res) => {
    res.send(`${process.env.APP_NAME} server is running`);
  });

  // init api routes
  app.use('/api/auth', AppEndpoints.AuthApi);
  app.use('/api/cex', AppConfig.MiddleWare.authenticateUser, AppEndpoints.CexApi);
  app.use('/api/dex', AppConfig.MiddleWare.authenticateUser, AppEndpoints.DexApi);
  app.use('/api/info', AppConfig.MiddleWare.authenticateUser, AppEndpoints.InfoApi);

  // start
  const port = process.env.PORT;
  app.listen(port, () => {
    AppConfig.Logger.info(`App listening at http://localhost:${port}`);
  });
};

boot();
