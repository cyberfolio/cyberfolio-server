import { logError } from '@src/utils'
import { getAllAssets } from '@src/api/dex/repository'
import scamTokens from '@config/scamTokens'
import { dexAssetModel } from '@src/api/dex/repository/models'

export const removeScamTokens = async () => {
  let count = 0
  try {
    const assets = await getAllAssets()
    for (const asset of assets) {
      const isScamToken = scamTokens.find(
        (scamToken) =>
          scamToken.contractAddress.toLowerCase() === asset.contractAddress.toLowerCase() &&
          scamToken.platform === asset.platform,
      )
      if (isScamToken) {
        try {
          await dexAssetModel.deleteOne({ contractAddress: asset.contractAddress })
          count = count + 1
        } catch (e) {
          logError({
            func: removeScamTokens.name,
            path: 'src/modules/cron/removeScamTokens.ts',
            e,
          })
        }
      }
    }
    return count
  } catch (e) {
    logError({
      func: removeScamTokens.name,
      path: 'src/modules/cron/removeScamTokens.ts',
      e,
    })
    throw e
  }
}
