/* eslint-disable no-console */
import mongoose from 'mongoose'
import { initCronJobs } from './modules/cron'

export const init = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`)
    initCronJobs()
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}
