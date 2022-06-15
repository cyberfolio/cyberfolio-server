import { Request } from 'express'

export interface AuthenticatedRequest extends Request {
  keyIdentifier: string
}

export enum Platform {
  BITCOIN = 'Bitcoin',
  ETHEREUM = 'Ethereum',
  BSC = 'SmartChain',
  AVALANCHE = 'Avalanche',
  SOLANA = 'Solana',
  POLKADOT = 'Polkadot',
  POLYGON = 'Polygon',
  ARBITRUM = 'Arbitrum',
  OPTIMISM = 'Optimism',
  BINANCE = 'Binance',
  FTX = 'FTX',
  GATEIO = 'Gateio',
  KUCOIN = 'Kucoin',
}
