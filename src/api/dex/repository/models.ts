import mongoose from "mongoose";

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
}

export interface Wallet {
  keyIdentifier: string;
  walletAddress: string;
  walletName: string;
  platform: Platform;
}
const walletSchema = new mongoose.Schema<Wallet>({
  keyIdentifier: { type: String, required: true },
  walletAddress: { type: String, required: true },
  walletName: { type: String, required: true },
  platform: { type: String, required: true },
});

export const walletsModel = mongoose.model<Wallet>("wallet", walletSchema);

export interface DexAsset {
  keyIdentifier: string;
  platform: Platform;
  name: string;
  symbol: string;
  logo: string;
  balance: number;
  price: number;
  value: number;
  walletName: string;
  contractAddress: string;
  walletAddress: string;
  scan: string;
}
const dexAssetSchema = new mongoose.Schema<DexAsset>({
  keyIdentifier: { type: String, required: true },
  platform: { type: String, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  logo: { type: String, required: true },
  balance: { type: Number, required: true },
  price: { type: Number, required: true },
  value: { type: Number, required: true },
  walletName: { type: String, required: true },
  walletAddress: { type: String, required: true },
  contractAddress: { type: String },
  scan: { type: String },
});

export const dexAssetModel = mongoose.model<DexAsset>("dex-asset", dexAssetSchema);
