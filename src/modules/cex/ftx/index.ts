import axios, { AxiosError } from 'axios'
import crypto from 'crypto-js'

import { roundNumber } from '@src/utils'
import { getCryptoCurrencyLogo } from '@providers/coinmarketcap'
import { FTXError } from '@config/custom-typings'

const API_URL = process.env.FTX_API_URL

export const getAssets = async ({
  apiKey,
  apiSecret,
}: {
  apiKey: string
  apiSecret: string
}) => {
  const timestamp = Date.now()
  const signatureString = `${timestamp}GET/api/wallet/all_balances`
  const signature = crypto
    .HmacSHA256(signatureString, apiSecret)
    .toString(crypto.enc.Hex)
  try {
    const allBalances = (await axios({
      url: `${API_URL}/wallet/all_balances`,
      method: 'get',
      headers: {
        'FTX-KEY': apiKey,
        'FTX-TS': timestamp.toString(),
        'FTX-SIGN': signature,
      },
    })) as any
    const balances = allBalances?.data?.result?.main?.filter((balance: any) => {
      if (Number(balance.usdValue) > 1) {
        return balance
      }
    })

    const response = []
    if (Array.isArray(balances) && balances.length > 0) {
      for (let i = 0; i < balances.length; i++) {
        const balance = roundNumber(balances[i].total)
        const symbol = balances[i].coin?.toLowerCase()
        const price = balances[i].usdValue / balances[i].total
        const name = balances[i].coin
        const value = roundNumber(parseFloat(balances[i].usdValue))
        let logo = await getCryptoCurrencyLogo({
          symbol,
        })
        if (symbol === 'usd') {
          logo =
            'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Dollar-USD-icon.png'
        }
        if (value > 1) {
          response.push({
            name,
            symbol,
            balance,
            price,
            value,
            logo,
            cexName: 'ftx',
          })
        }
      }
    }
    return response
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const ftxError = e as AxiosError<FTXError>
      if (
        ftxError.response?.data?.error === 'Not logged in: Invalid API key' &&
        ftxError.response?.status === 401
      ) {
        throw new Error('Your API Key is invalid')
      } else if (
        ftxError.response?.data?.error === 'Not logged in: Invalid signature' &&
        ftxError.response?.status === 401
      ) {
        throw new Error('Your API Secret is invalid')
      } else {
        throw new Error(ftxError.message)
      }
    } else {
      throw e
    }
  }
}
