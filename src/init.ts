/* eslint-disable no-console */
import { logger } from '@config/logger'
import mongoose from 'mongoose'
import { initCronJobs } from './modules/cron'

export const connectToDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`)
    logger.info('Mongodb successfully connected')
  } catch (e) {
    logger.error(`Error at src/init.ts ${connectToDB.name}`, e)
    process.exit(1)
  }
}

export const startCronJobs = async () => {
  try {
    await initCronJobs()
    logger.info('Cron jobs started')
  } catch (e) {
    logger.error(`Error at src/init.ts ${startCronJobs.name}`)
    process.exit(1)
  }
}
