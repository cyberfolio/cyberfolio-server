import Web3 from 'web3'
import axios from 'axios'

import { formatBalance, logError } from '@src/utils'
import { getCurrencyLogo } from '@providers/coingecko/repository'
import { Platform } from '@config/types'

const web3 = new Web3(new Web3.providers.HttpProvider(`${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`))
const coingeckoERC20TokenListURL = process.env.COINGECKO_ERC20_TOKEN_LIST_URL

export const isValidEthAddress = (address: string) => {
  return web3.utils.isAddress(address)
}

export const getEthBalance = async (walletAddress: string) => {
  try {
    const balance = await web3.eth.getBalance(walletAddress)
    return web3.utils.fromWei(balance, 'ether')
  } catch (e) {
    logError({
      e,
      func: getEthBalance.name,
      path: 'src/modules/dex/ethereum/services.ts',
    })
    throw e
  }
}

export const getERC20Tokens = async () => {
  try {
    const response = (await axios({
      url: coingeckoERC20TokenListURL,
      method: 'get',
    })) as any
    if (response?.data?.tokens) {
      const contracts = response.data.tokens.map((token: any) => {
        return {
          name: token.name,
          address: token.address,
          symbol: token.symbol,
        }
      })
      return contracts
    } else {
      return []
    }
  } catch (e) {
    logError({
      e,
      func: getERC20Tokens.name,
      path: 'src/modules/dex/ethereum/services.ts',
    })
    throw e
  }
}

export const getTokenBalances = async (walletAddress: string) => {
  try {
    const walletInfo = (await axios({
      url: `${process.env.COVALENT_V1_API_URL}/${process.env.ETHEREUM_MAINNET_CHAIN_ID}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`,
      method: 'get',
    })) as any
    const existingTokens = walletInfo?.data?.data?.items
    const response = []
    if (existingTokens && Array.isArray(existingTokens)) {
      for (let i = 0; i < existingTokens.length; i++) {
        if (existingTokens[i].balance > 0) {
          const balance = Number(
            parseFloat(
              formatBalance(existingTokens[i].balance, parseInt(existingTokens[i].contract_decimals) as any),
            )?.toFixed(2),
          )

          const price = existingTokens[i].quote_rate
          const value = balance * existingTokens[i].quote_rate
          const name = existingTokens[i].contract_name
          const symbol = existingTokens[i].contract_ticker_symbol?.toLowerCase()
          const contractAddress = existingTokens[i].contract_address
          const logo = await getCurrencyLogo(symbol)

          if (price && symbol) {
            response.push({
              name,
              symbol,
              contractAddress,
              type: existingTokens[i].type,
              logo,
              balance,
              price,
              value,
              platform: Platform.ETHEREUM,
              scan: `https://etherscan.io/tokenholdings?a=${walletAddress}`,
            })
          }
        }
      }
    }
    return response
  } catch (e) {
    logError({
      e,
      func: getTokenBalances.name,
      path: 'src/modules/dex/ethereum/services.ts',
    })
    throw e
  }
}
