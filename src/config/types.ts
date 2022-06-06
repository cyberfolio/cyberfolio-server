import { Request } from 'express'

export interface AuthenticatedRequest extends Request {
  keyIdentifier: string
}

export enum Platform {
  Arbitrum = 'arbitrum',
  Avalanche = 'avalanche',
  Bitcoin = 'bitcoin',
  Ethereum = 'ethereum',
  Optimism = 'optimism',
  Polkadot = 'polkadot',
  Polygon = 'polygon',
  SmartChain = 'smartchain',
  Solana = 'solana',
  Binance = 'binance',
  FTX = 'ftx',
  Gateio = 'gateio',
  Kucoin = 'kucoin',
}
