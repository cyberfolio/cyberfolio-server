import axios from 'axios'

import { sathoshiToBtcBalance } from '@src/utils'
import { getCurrentUSDPrice } from '@providers/coingecko'

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
      chain: 'bitcoin',
      scan: `https://www.blockchain.com/btc/address/${walletAddress}`,
    }
  } catch (e) {
    console.log(
      `Error at ${getBitcoinBalance.name} src/modules/dex/bitcoin/services.ts`,
    )
    throw e
  }
}
