import { Platform } from '@config/types'
import { logError } from '@src/utils'
import { cexInfoModel, cexAssetModel } from './models'

export const addCexByKeyIdentifier = async ({
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
  const cex = await cexInfoModel
    .findOne({
      keyIdentifier,
      cexName,
    })
    .lean()
  if (cex) {
    return
  }
  try {
    await cexInfoModel.create({
      keyIdentifier,
      apiKey,
      apiSecret,
      cexName,
      passphrase,
    })
  } catch (e) {
    logError({
      e,
      func: addCexByKeyIdentifier.name,
      path: 'src/api/cex/repository/index.ts',
    })
    throw e
  }
}

export const getCexInfosByKey = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  const cexes = await cexInfoModel
    .find({
      keyIdentifier,
    })
    .lean()
  return cexes
}

export const getCexInfo = async ({ keyIdentifier, cexName }: { keyIdentifier: string; cexName: Platform }) => {
  const cex = await cexInfoModel
    .findOne({
      keyIdentifier,
      cexName,
    })
    .lean()
  return cex
}

export const fetchSpotAssets = async ({ keyIdentifier, cexName }: { keyIdentifier: string; cexName: Platform }) => {
  const assets = await cexAssetModel
    .find({
      keyIdentifier,
      cexName,
    })
    .lean()
  return assets
}

export const fetchAllSpotAssets = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  const assets = await cexAssetModel
    .find({
      keyIdentifier,
    })
    .lean()
  return assets
}

export const addCexAsset = async ({
  keyIdentifier,
  cexName,
  name,
  symbol,
  balance,
  price,
  value,
  logo,
}: {
  keyIdentifier: string
  cexName: Platform
  name: string
  symbol: string
  balance: number
  price: number
  value: number
  logo: string | undefined
}) => {
  symbol = symbol.toLowerCase()
  try {
    await cexAssetModel.findOneAndUpdate(
      { keyIdentifier, cexName, name, symbol },
      {
        keyIdentifier,
        cexName,
        name,
        symbol,
        balance,
        price,
        value,
        logo,
      },
      { upsert: true, new: true },
    )
  } catch (e) {
    logError({
      e,
      func: addCexAsset.name,
      path: 'src/api/cex/repository/index.ts',
    })
    throw e
  }
}
