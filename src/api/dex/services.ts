import * as bitcoin from '@dex/bitcoin/services'
import * as avalanche from '@dex/avalanche/services'
import * as eth from '@dex/ethereum/services'
import * as arbitrum from '@dex/arbitrum/services'
import * as polygon from '@dex/polygon/services'
import * as smartchain from '@dex/smartchain/services'

import scamTokens from '@config/scamTokens'
import * as repository from './repository'

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
    const chain = wallet.chain
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
      saveAssets({ keyIdentifier, chain, walletName })
    } catch (e) {
      throw new Error(e.message)
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
    throw new Error(e)
  }
}

export const saveAssets = async ({
  keyIdentifier,
  chain,
  walletName,
}: {
  keyIdentifier: string
  chain: string
  walletName: string
}) => {
  if (chain === 'Evm') {
    try {
      const ethereumTokens = await eth.getTokenBalances(keyIdentifier)
      const avalancheTokens = await avalanche.getTokenBalances(keyIdentifier)
      const arbitrumTokens = await arbitrum.getTokenBalances(keyIdentifier)
      const polygonTokens = await polygon.getTokenBalances(keyIdentifier)
      const smartChaintokens = await smartchain.getTokenBalances(keyIdentifier)

      const allEvmTokens = [
        ...ethereumTokens,
        ...avalancheTokens,
        ...arbitrumTokens,
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
                walletName,
                keyIdentifier,
              })
            }
          }
        } catch (e) {
          throw new Error(e.message)
        }
      }
      return allEvmTokens
    } catch (e) {
      throw new Error(e)
    }
  }
  if (chain === 'bitcoin') {
    const btc = await bitcoin.getBitcoinBalance(keyIdentifier)
    const asset = {
      keyIdentifier,
      walletName,
      name: btc.name,
      symbol: btc.symbol.toLowerCase(),
      balance: btc.balance,
      price: btc.price,
      value: btc.value,
      chain: 'bitcoin',
      contractAddress: '',
    }
    try {
      await repository.addAsset(asset)
      return [bitcoin]
    } catch (e) {
      throw new Error(e)
    }
  }
}
