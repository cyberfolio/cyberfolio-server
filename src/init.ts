import logger from "@config/logger";
import mongoose from "mongoose";
import initCronJobs from "./modules/cron";
import migrations from "./migrations";

export const connectToDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`);
    logger.info("Mongodb successfully connected");
  } catch (e) {
    logger.error(`Error at src/init.ts ${connectToDB.name}`, e);
    process.exit(1);
  }
};

export const startCronJobs = async () => {
  try {
    await initCronJobs();
  } catch (e) {
    logger.error(`Error at src/init.ts ${startCronJobs.name}`);
    process.exit(1);
  }
};

export const runMigrations = async () => {
  try {
    await migrations();
  } catch (e) {
    logger.error(`Error at src/init.ts ${startCronJobs.name}`);
    process.exit(1);
  }
};
