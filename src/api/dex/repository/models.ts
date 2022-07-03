import { Chain } from "@config/types";
import mongoose from "mongoose";

export interface Wallet {
  keyIdentifier: string;
  walletAddress: string;
  walletName: string;
  chain: Chain;
}
const walletSchema = new mongoose.Schema<Wallet>({
  keyIdentifier: { type: String, required: true },
  walletAddress: { type: String, required: true },
  walletName: { type: String, required: true },
  chain: { type: String, required: true },
});

export const walletsModel = mongoose.model<Wallet>("wallet", walletSchema);

export interface DexAsset {
  keyIdentifier: string;
  chain: Chain;
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
  chain: { type: String, required: true },
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
