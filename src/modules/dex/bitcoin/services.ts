import axios from 'axios'

import { logError, sathoshiToBtcBalance } from '@src/utils'
import { getCurrentUSDPrice } from '@providers/coingecko'
import { Platform } from '@config/types'

export const getBitcoinBalance = async (walletAddress: string) => {
  try {
    const { data } = (await axios({
      url: `${process.env.BLOCKCHAIN_INFO_API_URL}/q/addressbalance/${walletAddress}`,
      method: 'get',
    })) as any
    const balance = sathoshiToBtcBalance(data)
    const price = await getCurrentUSDPrice('btc')
    const value = balance * price

    return {
      name: 'Bitcoin',
      symbol: 'btc',
      balance,
      price,
      logo: 'https://cdn.cdnlogo.com/logos/b/46/bitcoin.svg',
      value,
      platform: Platform.BITCOIN,
      scan: `https://www.blockchain.com/btc/address/${walletAddress}`,
    }
  } catch (e) {
    logError({
      e,
      func: getBitcoinBalance.name,
      path: 'src/modules/dex/arbitrum/avalanche.ts',
    })
    throw e
  }
}
