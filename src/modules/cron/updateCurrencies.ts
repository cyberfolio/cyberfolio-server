import { addOrUpdateAllCryptoPriceInUSD } from '@providers/coingecko'

export const updateCurrencies = async () => {
  for (let i = 1; i <= 6000; i++) {
    try {
      await addOrUpdateAllCryptoPriceInUSD(i)
    } catch (e) {
      console.log(e)
    }
  }
}
