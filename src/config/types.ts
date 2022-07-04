import { Request } from "express";
import { UserDoc } from "@api/auth/repository/models";

export interface AuthenticatedRequest extends Request {
  user?: UserDoc | null;
}

export enum Chain {
  BITCOIN = "Bitcoin",
  ETHEREUM = "Ethereum",
  BSC = "SmartChain",
  AVALANCHE = "Avalanche",
  SOLANA = "Solana",
  POLKADOT = "Polkadot",
  POLYGON = "Polygon",
  ARBITRUM = "Arbitrum",
  OPTIMISM = "Optimism",
}

export enum Platform {
  BITCOIN = "Bitcoin",
  ETHEREUM = "Ethereum",
  BSC = "SmartChain",
  AVALANCHE = "Avalanche",
  SOLANA = "Solana",
  POLKADOT = "Polkadot",
  POLYGON = "Polygon",
  ARBITRUM = "Arbitrum",
  OPTIMISM = "Optimism",
  BINANCE = "Binance",
  FTX = "FTX",
  GATEIO = "Gateio",
  KUCOIN = "Kucoin",
}

export type BinanceError = {
  code?: number;
  msg?: string;
};

export type FTXError = {
  error?: string;
};

export type GateIoError = {
  code?: string;
};

export type KucoinError = {
  code?: string;
};

export enum ScanURL {
  ETHEREUM = "https://etherscan.io",
  BSC = "https://bscscan.com",
  AVALANCHE = "https://snowtrace.io",
  POLYGON = "https://polygonscan.com",
  ARBITRUM = "https://arbiscan.io",
  OPTIMISM = "https://optimistic.etherscan.io",
}

export interface JwtTokenInterface {
  evmAddress?: string | undefined;
}
