import 'dotenv-safe/config';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import logger from '@config/logger';
import auth from './api/auth';
import dex from './api/dex';
import cex from './api/cex';
import info from './api/info';

import { connectToDB, runMigrations, startCronJobs } from './init';
import { allowedMethods, authenticateUser } from './config/middleware';

if (process.env.NODE_ENV !== 'development') {
  import('module-alias/register').catch((e) => {
    logger.error('Error while registering module-alias', e);
  });
}

const boot = async () => {
  await connectToDB();
  await startCronJobs();
  await runMigrations();

  const app = express();
  app.disable('x-powered-by');
  app.use(allowedMethods);
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
  app.use('/api/auth', auth);
  app.use('/api/cex', authenticateUser, cex);
  app.use('/api/dex', authenticateUser, dex);
  app.use('/api/info', authenticateUser, info);

  // start
  const port = process.env.PORT;
  app.listen(port, () => {
    logger.info(`App listening at http://localhost:${port}`);
  });
};

boot();
