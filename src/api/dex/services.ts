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

export const addWallets = async ({
  keyIdentifier,
  wallets,
}: {
  keyIdentifier: string
  wallets: [{ address: string; name: string; chain: string }]
}) => {
  for (const wallet of wallets) {
    const walletAddress = wallet.address
    const walletName = wallet.name
    const chain = wallet.chain.toLowerCase()
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
        chain,
      })
      saveAssets({ keyIdentifier, chain, walletName, walletAddress })
    } catch (e) {
      onError(e)
    }
  }
}

export const getAssets = async ({
  keyIdentifier,
  chain,
}: {
  keyIdentifier: string
  chain: string
}) => {
  try {
    const assets = await repository.getAssetsByKeyAndChain({
      keyIdentifier,
      chain,
    })
    return assets
  } catch (e) {
    onError(e)
  }
}

export const saveAssets = async ({
  walletAddress,
  keyIdentifier,
  chain,
  walletName,
}: {
  walletAddress: string
  keyIdentifier: string
  chain: string
  walletName: string
}) => {
  if (chain.toLowerCase() === 'eth') {
    const ethereumTokens = await eth.getTokenBalances(walletAddress)
    if (Array.isArray(ethereumTokens) && ethereumTokens.length > 0) {
      try {
        for (let i = 0; i < ethereumTokens.length; i++) {
          const isScamToken =
            scamTokens.filter((scamToken) => {
              return (
                scamToken.chain === ethereumTokens[i].chain &&
                scamToken.contractAddress === ethereumTokens[i].contractAddress
              )
            }).length > 0
          if (!isScamToken && ethereumTokens[i].value >= 1) {
            await repository.addAsset({
              name: ethereumTokens[i].name,
              symbol: ethereumTokens[i].symbol,
              balance: ethereumTokens[i].balance,
              contractAddress: ethereumTokens[i].contractAddress,
              price: ethereumTokens[i].price,
              value: ethereumTokens[i].value,
              chain: ethereumTokens[i].chain,
              scan: ethereumTokens[i].scan,
              walletName,
              keyIdentifier,
              walletAddress,
            })
          }
        }
      } catch (e) {
        onError(e)
      }
      return ethereumTokens
    }
  } else if (chain.toLowerCase() === 'evm') {
    try {
      const avalancheTokens = await avalanche.getTokenBalances(walletAddress)
      const arbitrumTokens = await arbitrum.getTokenBalances(walletAddress)
      const optimismTokens = await optimism.getTokenBalances(walletAddress)

      const polygonTokens = await polygon.getTokenBalances(walletAddress)
      const smartChaintokens = await smartchain.getTokenBalances(walletAddress)
      const ethereumTokens = await eth.getTokenBalances(walletAddress)

      const allEvmTokens = [
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
            const isScamToken =
              scamTokens.filter((scamToken) => {
                return (
                  scamToken.chain === allEvmTokens[i].chain &&
                  scamToken.contractAddress === allEvmTokens[i].contractAddress
                )
              }).length > 0
            if (!isScamToken && allEvmTokens[i].value >= 1) {
              await repository.addAsset({
                name: allEvmTokens[i].name,
                symbol: allEvmTokens[i].symbol,
                balance: allEvmTokens[i].balance,
                contractAddress: allEvmTokens[i].contractAddress,
                price: allEvmTokens[i].price,
                value: allEvmTokens[i].value,
                chain: allEvmTokens[i].chain,
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
  } else if (chain.toLowerCase() === 'bitcoin') {
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
      chain: 'bitcoin',
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
