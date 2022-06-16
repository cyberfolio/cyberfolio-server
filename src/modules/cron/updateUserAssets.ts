import { addOrUpdateCryptoCurrencies } from '@providers/coingecko'
import { getFilePath, logError } from '@src/utils'

const path = getFilePath(__filename)

const updateUserAssets = async () => {
  for (let i = 1; i <= 6000; i++) {
    try {
      await addOrUpdateCryptoCurrencies(i)
    } catch (e) {
      logError({
        func: updateUserAssets.name,
        path,
        e,
      })
      throw e
    }
  }
}

export default updateUserAssets
