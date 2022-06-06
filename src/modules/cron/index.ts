import { logger } from '@config/logger'
import { logError } from '@src/utils'
import cron from 'node-cron'
import { removeScamTokens } from './removeScamTokens'
import { updateCurrencies } from './updateCurrencies'

const everyHourCronValue = '0 0 */1 * * *'
const everyMinuteCronValue = '0 */1 * * * *'

export const initCronJobs = async () => {
  cron.schedule(everyHourCronValue, async () => {
    try {
      logger.info('Running cryptoprice update')
      await updateCurrencies()
      logger.info('Cryptoprice update completed')
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
      logger.info('Deleting scam tokens')
      const numberOfScamsDeleted = await removeScamTokens()
      logger.info(`Deleting scam tokens completed, total: ${numberOfScamsDeleted}`)
    } catch (e) {
      if (e instanceof Error) {
        logError({ path: 'src/modules/cron/index.ts', func: initCronJobs.name, e })
      } else {
        logError({ e: 'unknown error', path: 'src/modules/cron/index.ts', func: initCronJobs.name })
      }
    }
  })
}
