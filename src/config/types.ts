import { Request } from 'express';
import { UserDoc } from '@api/auth/repository/models';

export interface AuthenticatedRequest extends Request {
  user?: UserDoc | null;
}

export enum Chain {
  BITCOIN = 'Bitcoin',
  ETHEREUM = 'Ethereum',
  BSC = 'SmartChain',
  AVALANCHE = 'Avalanche',
  SOLANA = 'Solana',
  POLKADOT = 'Polkadot',
  POLYGON = 'Polygon',
  ARBITRUM = 'Arbitrum',
  OPTIMISM = 'Optimism',
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
  GATEIO = 'Gateio',
  KUCOIN = 'Kucoin',
}

export enum CexName {
  BINANCE = 'Binance',
  BINANCETR = 'BinanceTR',
  GATEIO = 'Gateio',
  KUCOIN = 'Kucoin',
}
export interface CexAssetResponse {
  cexName: CexName;
  name: string;
  symbol: string;
  contractAddress: string;
  logo?: string;
  balance: number;
  price: number;
  value: number;
  accountName: string;
}

export type BinanceError = {
  code?: number;
  msg?: string;
};

export type GateIoError = {
  code?: string;
};

export type KucoinError = {
  code?: string;
};

export enum ScanURL {
  ETHEREUM = 'https://etherscan.io',
  BSC = 'https://bscscan.com',
  BITCOIN = 'https://www.blockchain.com',
  AVALANCHE = 'https://snowtrace.io',
  POLYGON = 'https://polygonscan.com',
  ARBITRUM = 'https://arbiscan.io',
  OPTIMISM = 'https://optimistic.etherscan.io',
  SOLANA = 'https://explorer.solana.com',
}

export interface JwtTokenInterface {
  evmAddress?: string | undefined;
}
