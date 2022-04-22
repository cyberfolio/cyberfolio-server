import axios from 'axios'
import crypto from 'crypto-js'
import { roundNumber } from '@src/utils'

import {
  getCurrentUSDPrice,
  getFullNameOfTheCurrency,
  getContractAddress,
} from '@providers/coingecko'

const API_VERSION = process.env.KUCOIN_API_VERSION as string
const API_URL = process.env.KUCOIN_API_URL

export const getAssets = async ({
  type,
  apiKey,
  apiSecret,
  passphrase,
}: {
  type: string
  apiKey: string
  apiSecret: string
  passphrase: string
}) => {
  const timestamp = Date.now().toString()
  const endpoint = `/api/v1/accounts?type=${type}`
  const stringToSign = `${timestamp}GET${endpoint}`
  const signedString = crypto
    .HmacSHA256(stringToSign, apiSecret)
    .toString(crypto.enc.Base64)

  const encryptedApiVersion = crypto
    .HmacSHA256(API_VERSION, apiSecret)
    .toString(crypto.enc.Base64)

  try {
    const accountInfo = (await axios({
      url: `${API_URL}${endpoint}`,
      method: 'GET',
      headers: {
        'KC-API-KEY': apiKey,
        'KC-API-SIGN': signedString,
        'KC-API-TIMESTAMP': timestamp,
        'KC-API-PASSPHRASE': passphrase,
        'KC-API-KEY-VERSION': encryptedApiVersion,
      },
    })) as any

    const data = accountInfo?.data?.data
    const response = []
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const balance = roundNumber(data[i].holds)
        if (balance > 0) {
          const symbol = data[i].currency?.toLowerCase()
          const price = await getCurrentUSDPrice(symbol)
          const name = await getFullNameOfTheCurrency(symbol)
          const contractAddress = await getContractAddress(symbol)
          const value = roundNumber(balance * price)
          response.push({
            name,
            symbol,
            type: 'cryptocurrency',
            contractAddress,
            balance,
            price,
            value,
            cexName: 'kucoin',
          })
        }
      }
    }

    return response
  } catch (e) {
    if (e.response?.data?.code === '400003') {
      throw new Error('Api key or secret is not valid.')
    } else if (e?.response?.data?.code === '400005') {
      throw new Error('Server error, please contact the admin.')
    } else {
      throw new Error(e.message)
    }
  }
}
