import { Platform } from '@config/types'
import { getCurrenyInfo } from '@providers/coingecko/repository'
import { logError } from '@src/utils'
import { walletsModel, dexAssetModel } from './models'

export const addWalletByKeyIdentifier = async ({
  keyIdentifier,
  walletAddress,
  walletName,
  platform,
}: {
  keyIdentifier: string
  walletAddress: string
  walletName: string
  platform: Platform
}) => {
  const wallet = await walletsModel
    .findOne({
      keyIdentifier,
      walletAddress,
    })
    .lean()
  if (wallet) {
    return
  }
  await walletsModel.create({
    keyIdentifier,
    walletAddress,
    walletName,
    platform,
  })
}

export const getWalletsByKey = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  const wallets = await walletsModel.find({ keyIdentifier }).lean().exec()
  return wallets
}

export const getWallet = async ({ keyIdentifier, platform }: { keyIdentifier: string; platform: Platform }) => {
  const wallet = await walletsModel.findOne({ keyIdentifier, platform }).lean()
  return wallet
}

export const getWalletByName = async ({ keyIdentifier, walletName }: { keyIdentifier: string; walletName: string }) => {
  const wallet = await walletsModel.findOne({ keyIdentifier, walletName }).lean()
  return wallet
}

export const addAsset = async ({
  keyIdentifier,
  walletName,
  name,
  symbol,
  balance,
  price,
  value,
  platform,
  contractAddress,
  walletAddress,
  scan,
}: {
  keyIdentifier: string
  walletName: string
  name: string
  symbol: string
  balance: number
  price: number
  value: number
  platform: Platform
  contractAddress: string
  walletAddress: string
  scan: string
}) => {
  try {
    symbol = symbol.toLowerCase()
    const currenyInfo = await getCurrenyInfo(symbol)
    const logo = currenyInfo?.logo ? currenyInfo?.logo : undefined
    await dexAssetModel.findOneAndUpdate(
      { walletAddress, keyIdentifier, name, symbol, platform },
      {
        keyIdentifier,
        walletName,
        name,
        symbol,
        balance,
        price,
        value,
        logo,
        platform,
        contractAddress,
        walletAddress,
        scan,
      },
      { upsert: true, new: true },
    )
  } catch (e) {
    logError({
      e,
      func: addAsset.name,
      path: 'src/api/dex/repository/index.ts',
    })
    throw e
  }
}

export const getAssetsByKeyAndChain = async ({
  keyIdentifier,
  platform,
}: {
  keyIdentifier: string
  platform: Platform
}) => {
  try {
    const assets = await dexAssetModel.find({ keyIdentifier, platform }).lean()
    return assets
  } catch (e) {
    logError({
      e,
      func: getAssetsByKeyAndChain.name,
      path: 'src/api/dex/repository/index.ts',
    })
    throw e
  }
}

export const getAssetsByKey = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  try {
    const assets = await dexAssetModel.find({ keyIdentifier }).lean()
    return assets
  } catch (e) {
    logError({
      e,
      func: getAssetsByKey.name,
      path: 'src/api/dex/repository/index.ts',
    })
    throw e
  }
}

export const getAllAssets = async () => {
  try {
    const assets = await dexAssetModel.find({}).lean()
    return assets
  } catch (e) {
    logError({
      e,
      func: getAllAssets.name,
      path: 'src/api/dex/repository/index.ts',
    })
    throw e
  }
}
