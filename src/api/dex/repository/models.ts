import AppStructures from '@structures/index';
import mongoose, { Document } from 'mongoose';

export interface Wallet {
  keyIdentifier: string;
  walletAddress: string;
  walletName: string;
  chain: AppStructures.Chain;
}
const walletSchema = new mongoose.Schema<Wallet>({
  keyIdentifier: { type: String, required: true },
  walletAddress: { type: String, required: true },
  walletName: { type: String, required: true },
  chain: { type: String, required: true },
});

export const walletsModel =
  (mongoose.models.Wallet as mongoose.Model<Wallet>) || mongoose.model<Wallet>('wallet', walletSchema);

export interface DexAsset {
  keyIdentifier: string;
  chain: AppStructures.Chain;
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
export interface DexAssetDoc extends DexAsset, Document {}

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

export const dexAssetModel =
  (mongoose.models.DexAsset as mongoose.Model<DexAsset>) || mongoose.model<DexAsset>('dex-asset', dexAssetSchema);
