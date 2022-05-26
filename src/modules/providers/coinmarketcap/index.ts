import { sleep } from '@src/utils'
import axios from 'axios'

const apiKey = process.env.COINMARKETCAP_API_KEY as string
export const getCryptoCurrencyLogo = async ({
  symbol,
}: {
  symbol: string
}): Promise<string | undefined> => {
  try {
    const response = (await axios.request({
      url: `${process.env.COINMARKETCAP_API_URL}/cryptocurrency/info?symbol=${symbol}`,
      method: 'get',
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      },
    })) as any
    await sleep(200)

    if (Array.isArray(response?.data?.data[symbol.toUpperCase()])) {
      if (response?.data?.data[symbol.toUpperCase()][0]?.logo) {
        return response?.data?.data[symbol.toUpperCase()][0]?.logo
      }
      return undefined
    }
    if (response?.data?.data?.logo) {
      return response?.data?.data?.logo
    }
    return undefined
  } catch (e) {
    console.log(
      `Error at ${getCryptoCurrencyLogo.name} src/modules/providers/coinmarketcap/index.ts`,
    )
    return undefined
  }
}
