import * as bitcoin from '@dex/bitcoin/services'
import * as avalanche from '@dex/avalanche/services'
import * as eth from '@dex/ethereum/services'
import * as arbitrum from '@dex/arbitrum/services'
import * as optimism from '@dex/optimism/services'
import * as polygon from '@dex/polygon/services'
import * as smartchain from '@dex/smartchain/services'

import scamTokens from '@config/scamTokens'
import * as repository from './repository'
import { onError } from '@src/utils'
import { Platform } from '@config/types'

export const addWallets = async ({
  keyIdentifier,
  wallets,
}: {
  keyIdentifier: string
  wallets: [{ address: string; name: string; platform: Platform }]
}) => {
  for (const wallet of wallets) {
    const walletAddress = wallet.address
    const walletName = wallet.name
    const platform = wallet.platform
    try {
      const doesExists = await repository.getWalletByName({
        keyIdentifier,
        walletName,
      })
      if (doesExists) {
        throw new Error(`You already have a wallet named ${walletName}`)
      }
      await repository.addWalletByKeyIdentifier({
        keyIdentifier,
        walletAddress,
        walletName,
        platform,
      })
      saveAssets({ keyIdentifier, platform, walletName, walletAddress })
    } catch (e) {
      onError(e)
    }
  }
}

export const getAssets = async ({ keyIdentifier, platform }: { keyIdentifier: string; platform: Platform }) => {
  try {
    const assets = await repository.getAssetsByKeyAndChain({
      keyIdentifier,
      platform,
    })

    return assets
  } catch (e) {
    onError(e)
  }
}

export const saveAssets = async ({
  walletAddress,
  keyIdentifier,
  platform,
  walletName,
}: {
  walletAddress: string
  keyIdentifier: string
  platform: Platform
  walletName: string
}) => {
  if (platform === Platform.ETHEREUM) {
    try {
      const avalancheTokens = await avalanche.getTokenBalances(walletAddress)
      const arbitrumTokens = await arbitrum.getTokenBalances(walletAddress)
      const optimismTokens = await optimism.getTokenBalances(walletAddress)
      const polygonTokens = await polygon.getTokenBalances(walletAddress)
      const smartChaintokens = await smartchain.getTokenBalances(walletAddress)
      const ethereumTokens = await eth.getTokenBalances(walletAddress)

      const allEvmTokens: {
        name: any
        symbol: any
        contractAddress: any
        type: any
        logo: any
        balance: number
        price: any
        value: number
        platform: Platform
        scan: string
      }[] = [
        ...ethereumTokens,
        ...avalancheTokens,
        ...arbitrumTokens,
        ...optimismTokens,
        ...polygonTokens,
        ...smartChaintokens,
      ]

      if (Array.isArray(allEvmTokens) && allEvmTokens.length > 0) {
        try {
          for (let i = 0; i < allEvmTokens.length; i++) {
            const isScamToken = scamTokens.find(
              (scamToken) =>
                scamToken.contractAddress.toLowerCase() === allEvmTokens[i].contractAddress.toLowerCase() &&
                scamToken.platform === allEvmTokens[i].platform,
            )
            if (!isScamToken && allEvmTokens[i].value >= 1) {
              await repository.addAsset({
                name: allEvmTokens[i].name,
                symbol: allEvmTokens[i].symbol,
                balance: allEvmTokens[i].balance,
                contractAddress: allEvmTokens[i].contractAddress,
                price: allEvmTokens[i].price,
                value: allEvmTokens[i].value,
                platform: allEvmTokens[i].platform,
                scan: allEvmTokens[i].scan,
                walletName,
                keyIdentifier,
                walletAddress,
              })
            }
          }
        } catch (e) {
          onError(e)
        }
      }
      return allEvmTokens
    } catch (e) {
      onError(e)
    }
  } else if (platform === Platform.BITCOIN) {
    const btc = await bitcoin.getBitcoinBalance(walletAddress)

    const asset = {
      keyIdentifier,
      walletName,
      name: btc.name,
      symbol: btc.symbol.toLowerCase(),
      balance: btc.balance,
      price: btc.price,
      value: btc.value,
      scan: btc.scan,
      platform: Platform.BITCOIN,
      contractAddress: '',
      walletAddress,
    }

    try {
      await repository.addAsset(asset)
      return [bitcoin]
    } catch (e) {
      onError(e)
    }
  }
}
