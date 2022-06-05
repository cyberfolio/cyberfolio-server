import { logError } from '@src/utils'
import cron from 'node-cron'
import { updateCurrencies } from './updateCurrencies'

const everyHourCronValue = '0 0 */1 * * *'

export const initCronJobs = async () => {
  cron.schedule(everyHourCronValue, async () => {
    try {
      console.log('Running cryptoprice update at: ' + new Date())
      await updateCurrencies()
      console.log('Cryptoprice update completed at: ' + new Date())
    } catch (e) {
      if (e instanceof Error) {
        logError({
          e,
          path: 'src/modules/cron/index.ts',
          func: initCronJobs.name,
        })
      } else {
        logError({
          e: 'unknown error',
          path: 'src/modules/cron/index.ts',
          func: initCronJobs.name,
        })
      }
    }
  })
}
