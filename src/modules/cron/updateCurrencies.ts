import { sleep } from '@src/utils'
import { addOrUpdateAllCryptoPriceInUSD } from '@providers/coingecko'

export const updateCurrencies = async () => {
  for (let i = 1; i <= 6000; i++) {
    try {
      await addOrUpdateAllCryptoPriceInUSD(i)
      await sleep(2000)
    } catch (e) {
      throw new Error(e)
    }
  }
}
