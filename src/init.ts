import mongoose from 'mongoose';
import Moralis from 'moralis';
import initCronJobs from './modules/cron';
import migrations from './migrations';
import AppConfig from './config';

export const connectToDB = async () => {
  try {
    AppConfig.Logger.info('Conntecting to Mongodb...');
    await mongoose.connect(`${process.env.MONGO_URL}`);
    AppConfig.Logger.info('Successfully connected to Mongodb');
  } catch (e) {
    AppConfig.Logger.error(`Error at src/init.ts ${connectToDB.name}`, e);
    process.exit(1);
  }
};

export const startCronJobs = async () => {
  try {
    await initCronJobs();
  } catch (e) {
    AppConfig.Logger.error(`Error at src/init.ts ${startCronJobs.name}`);
    process.exit(1);
  }
};

export const startMoralis = async () => {
  try {
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });
  } catch (e) {
    AppConfig.Logger.error(`Error at src/init.ts ${startMoralis.name}`, e);
    process.exit(1);
  }
};

export const runMigrations = async () => {
  try {
    await migrations();
  } catch (e) {
    AppConfig.Logger.error(`Error at src/init.ts ${startCronJobs.name}`);
    process.exit(1);
  }
};
