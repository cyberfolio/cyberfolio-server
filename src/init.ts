/* eslint-disable no-console */
import mongoose from 'mongoose'
import { initCronJobs } from './modules/cron'

export const init = async () => {
  try {
    await mongoose.connect(
      `mongodb://localhost:27017/${process.env.APP_NAME}`,
      { autoIndex: false },
    )
    initCronJobs()
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}
