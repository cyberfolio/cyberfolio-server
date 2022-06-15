import { logger } from '@config/logger'
import { logError } from '@src/utils'
import cron from 'node-cron'
import { removeScamTokens } from './removeScamTokens'
import { updateCurrencies } from './updateCurrencies'

const ever2HourCronValue = '0 0 */2 * * *'
const everyMinuteCronValue = '0 */1 * * * *'

export const initCronJobs = async () => {
  cron.schedule(ever2HourCronValue, async () => {
    try {
      logger.info('Running currency update')
      await updateCurrencies()
      logger.info('Currency update completed')
    } catch (e) {
      if (e instanceof Error) {
        logError({ path: 'src/modules/cron/index.ts', func: initCronJobs.name, e })
      } else {
        logError({ e: 'unknown error', path: 'src/modules/cron/index.ts', func: initCronJobs.name })
      }
    }
  })

  cron.schedule(everyMinuteCronValue, async () => {
    try {
      await removeScamTokens()
    } catch (e) {
      if (e instanceof Error) {
        logError({ path: 'src/modules/cron/index.ts', func: initCronJobs.name, e })
      } else {
        logError({ e: 'unknown error', path: 'src/modules/cron/index.ts', func: initCronJobs.name })
      }
    }
  })
}
