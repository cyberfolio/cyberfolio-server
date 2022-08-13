import { CexName } from '@config/types';
import mongoose from 'mongoose';

// CEX INFO
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
  cexName: {
    type: String,
    enum: CexName,
  },
  passphrase: String,
});
export const cexInfoModel = mongoose.model<CexInfo>('cex-info', cexInfoSchema);

// CEX ASSET
export interface CexAsset {
  keyIdentifier: string;
  cexName: CexName;
  name: string;
  symbol: string;
  logo: string;
  balance: number;
  price: number;
  value: number;
  accountName: string;
}
const cexAssetSchema = new mongoose.Schema<CexAsset>({
  keyIdentifier: String,
  cexName: {
    type: String,
    enum: CexName,
  },
  name: String,
  symbol: String,
  logo: String,
  balance: Number,
  price: Number,
  value: Number,
  accountName: String,
});
export const cexAssetModel = mongoose.model<CexAsset>('cex-asset', cexAssetSchema);

// CEX PAYMENT HISTORY
export interface CexPaymentHistory {
  keyIdentifier: string;
  orderNo: string;
  cexName: CexName;
  type: string;
  fee: string;
  status: string;
  date: string;
  createTime: number;
  fiatCurrency: string;
  amount: number;
}
const cexPaymentHistorySchema = new mongoose.Schema<CexPaymentHistory>({
  keyIdentifier: {
    type: String,
    required: true,
  },
  orderNo: {
    type: String,
    required: true,
  },
  cexName: {
    type: String,
    enum: CexName,
  },
  type: {
    type: String,
    required: true,
  },
  fee: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  createTime: {
    type: Number,
    required: true,
  },
  fiatCurrency: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});
export const cexPaymentHistoryModel = mongoose.model<CexPaymentHistory>('cex-payment-history', cexPaymentHistorySchema);
