import { onError } from '@src/utils'
import * as cexRepo from '../cex/services'
import * as dexRepo from '../dex/repository'

export const getNetWorth = async ({
  keyIdentifier,
}: {
  keyIdentifier: string
}) => {
  try {
    const dexAssets = await dexRepo.getAssetsByKey({ keyIdentifier })
    const dexTotalValue = dexAssets.reduce(function (acc: any, obj: any) {
      return acc + obj.value
    }, 0)

    const cexAssets = await cexRepo.getAllSpot({ keyIdentifier })
    let cexTotalValue = 0
    if (cexAssets) {
      cexTotalValue = cexAssets.reduce(function (acc: any, obj: any) {
        return acc + obj.value
      }, 0)
    }
    return dexTotalValue + cexTotalValue
  } catch (e) {
    onError(e)
  }
}

export const getAvailableAccounts = async ({
  keyIdentifier,
}: {
  keyIdentifier: string
}) => {
  try {
    const dexAssets = await dexRepo.getWalletsByKey({
      keyIdentifier,
    })
    const availableChains: string[] = []
    dexAssets.map((dexAsset) => {
      availableChains.push(dexAsset.chain.toLowerCase())
    })

    const cexAssets = await cexRepo.getAvailableCexes({ keyIdentifier })
    const availableCexes: string[] = []
    cexAssets.map((dexAsset) => {
      availableChains.push(dexAsset.cexName.toLowerCase())
    })

    return [...availableChains, ...availableCexes]
  } catch (e) {
    onError(e)
  }
}
