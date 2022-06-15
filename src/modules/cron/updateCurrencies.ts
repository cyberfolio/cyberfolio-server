import { addOrUpdateCryptoCurrencies } from '@providers/coingecko'
import { logError } from '@src/utils'

export const updateCurrencies = async () => {
  for (let i = 1; i <= 6000; i++) {
    try {
      await addOrUpdateCryptoCurrencies(i)
    } catch (e) {
      logError({
        func: updateCurrencies.name,
        path: 'src/modules/cron/updateCurrencies.ts',
        e,
      })
      throw e
    }
  }
}
