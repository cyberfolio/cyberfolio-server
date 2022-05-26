import cron from 'node-cron'
import { updateCurrencies } from './updateCurrencies'

const everyHourCronValue = '0 0 */1 * * *'

export const initCronJobs = async () => {
  try {
    console.log('Cryptoprice update started at: ' + new Date())
    await updateCurrencies()
    console.log('Cryptoprice update completed at: ' + new Date())
  } catch (e) {
    console.log('Cryptoprice update failed at, reason: ' + e.message)
  }
  cron.schedule(everyHourCronValue, async () => {
    console.log('Running cryptoprice update at: ' + new Date())
    try {
      await updateCurrencies()
      console.log('Cryptoprice update completed at: ' + new Date())
    } catch (e) {
      console.log('Cryptoprice update failed at, reason: ' + e.message)
    }
  })
}
