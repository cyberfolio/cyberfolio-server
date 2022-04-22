import axios from 'axios'
import crypto from 'crypto-js'

import { roundNumber } from '@src/utils'

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
        response.push({
          name,
          symbol,
          balance,
          price,
          value,
          cexName: 'ftx',
        })
      }
    }
    return response
  } catch (e) {
    if (
      e?.response?.data?.error === 'Not logged in: Invalid API key' &&
      e.response?.status === 401
    ) {
      throw new Error('Your API Key is invalid')
    } else if (
      e?.response?.data?.error === 'Not logged in: Invalid signature' &&
      e.response?.status === 401
    ) {
      throw new Error('Your API Secret is invalid')
    } else {
      throw new Error(e.message)
    }
  }
}
