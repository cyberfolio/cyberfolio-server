import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  keyIdentifier: String,
  walletAddress: String,
  walletName: String,
  chain: String,
});
walletSchema.index({
  keyIdentifier: 1,
  walletAddress: 1,
  walletName: 1,
  chain: 1,
});

export const walletsModel = mongoose.model("wallet", walletSchema);
walletsModel.on("index", (error) => {
  if (error) {
    console.log(error);
  }
});

const dexAssetSchema = new mongoose.Schema({
  keyIdentifier: String,
  chain: String,
  name: String,
  symbol: String,
  logo: String,
  balance: Number,
  price: Number,
  value: Number,
  walletName: String,
  contractAddress: String,
});
dexAssetSchema.index({
  keyIdentifier: 1,
  chain: 1,
  name: 1,
  symbol: 1,
});

export const dexAssetModel = mongoose.model("dex-asset", dexAssetSchema);
dexAssetModel.on("index", (error) => {
  if (error) {
    console.log(error);
  }
});
