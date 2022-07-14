import 'module-alias/register';
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

import { connectToDB, startCronJobs, runMigrations } from './init';
import { allowedMethods, authenticateUser } from './config/middleware';

const boot = async () => {
  // To get the directory name

  await connectToDB();
  await startCronJobs();
  await runMigrations();

  const app = express();
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
    res.send('Hello World!');
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
