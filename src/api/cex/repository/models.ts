import { CexName } from "@config/types";
import mongoose from "mongoose";

interface CexInfo {
  keyIdentifier: string;
  apiKey: string;
  apiSecret: string;
  cexName: CexName;
  passphrase: string;
}
const cexInfoSchema = new mongoose.Schema<CexInfo>({
  keyIdentifier: String,
  apiKey: String,
  apiSecret: String,
  cexName: String,
  passphrase: String,
});
export const cexInfoModel = mongoose.model<CexInfo>("cex-info", cexInfoSchema);

export interface CexAsset {
  keyIdentifier: string;
  cexName: CexName;
  name: string;
  symbol: string;
  logo: string;
  balance: number;
  price: number;
  value: number;
}
const cexAssetSchema = new mongoose.Schema<CexAsset>({
  keyIdentifier: String,
  cexName: String,
  name: String,
  symbol: String,
  logo: String,
  balance: Number,
  price: Number,
  value: Number,
});
export const cexAssetModel = mongoose.model<CexAsset>("cex-asset", cexAssetSchema);
