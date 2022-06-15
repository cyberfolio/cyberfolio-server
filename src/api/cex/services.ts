import * as binance from '@cex//binance'
import * as kucoin from '@cex/kucoin'
import * as gateio from '@cex/gateio'
import * as ftx from '@cex/ftx'

import * as repository from './repository'
import { onError } from '@src/utils'
import { Platform } from '@config/types'

export const checkIfExists = async ({ keyIdentifier, cexName }: { keyIdentifier: string; cexName: Platform }) => {
  const cexInfo = await repository.getCexInfo({
    keyIdentifier,
    cexName,
  })
  if (cexInfo) {
    throw new Error(`You have already added ${cexName}`)
  }
}

export const getAvailableCexes = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  const cexInfo = await repository.getCexInfosByKey({
    keyIdentifier,
  })
  return cexInfo
}

export const addCex = async ({
  keyIdentifier,
  apiKey,
  apiSecret,
  cexName,
  passphrase,
}: {
  keyIdentifier: string
  apiKey: string
  apiSecret: string
  cexName: Platform
  passphrase: string
}) => {
  try {
    await checkIfExists({ keyIdentifier, cexName })
    const assets = await saveSpotAssets({
      cexName,
      apiKey,
      apiSecret,
      keyIdentifier,
      passphrase,
    })
    await repository.addCexByKeyIdentifier({
      keyIdentifier,
      apiKey,
      apiSecret,
      cexName,
      passphrase,
    })
    return assets
  } catch (e) {
    onError(e)
  }
}

export const saveSpotAssets = async ({
  cexName,
  apiKey,
  apiSecret,
  passphrase,
  keyIdentifier,
}: {
  cexName: Platform
  apiKey: string
  apiSecret: string
  passphrase: string
  keyIdentifier: string
}) => {
  let spotAssets = [] as any
  try {
    if (cexName === Platform.BINANCE) {
      spotAssets = await binance.getAssets({ apiKey, apiSecret })
    } else if (cexName === Platform.KUCOIN) {
      spotAssets = await kucoin.getAssets({
        type: 'main',
        apiKey,
        apiSecret,
        passphrase,
      })
    } else if (cexName === Platform.GATEIO) {
      spotAssets = await gateio.getAssets({
        apiKey,
        apiSecret,
      })
    } else if (cexName === Platform.FTX) {
      spotAssets = await ftx.getAssets({
        apiKey,
        apiSecret,
      })
    } else {
      throw new Error(`We do not support ${cexName} currently.`)
    }
    if (Array.isArray(spotAssets) && spotAssets.length > 0) {
      try {
        for (let i = 0; i < spotAssets.length; i++) {
          await repository.addCexAsset({
            name: spotAssets[i].name,
            symbol: spotAssets[i].symbol?.toLowerCase(),
            balance: spotAssets[i].balance,
            price: spotAssets[i].price,
            value: spotAssets[i].value,
            cexName: spotAssets[i].cexName,
            logo: spotAssets[i].logo,
            keyIdentifier,
          })
        }
      } catch (e) {
        onError(e)
      }
    }
    return spotAssets
  } catch (e) {
    onError(e)
  }
}

export const getSpotAssetsByCexName = async ({
  keyIdentifier,
  cexName,
}: {
  keyIdentifier: string
  cexName: Platform
}) => {
  try {
    const cexInfo = await repository.getCexInfo({
      keyIdentifier,
      cexName,
    })
    if (!cexInfo) {
      return []
    }
    const assets = await repository.fetchSpotAssets({
      keyIdentifier,
      cexName,
    })
    return assets
  } catch (e) {
    onError(e)
  }
}

export const getAllSpot = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  try {
    const assets = await repository.fetchAllSpotAssets({
      keyIdentifier,
    })
    return assets
  } catch (e) {
    onError(e)
  }
}
