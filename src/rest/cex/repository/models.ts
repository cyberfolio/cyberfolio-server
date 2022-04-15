import mongoose from "mongoose";

const cexSchema = new mongoose.Schema({
  keyIdentifier: String,
  apiKey: String,
  apiSecret: String,
  cexName: String,
  passphrase: String,
});
cexSchema.index({ keyIdentifier: 1, cexName: 1 });

export const cexInfoModel = mongoose.model("cex-info", cexSchema);
cexInfoModel.on("index", (error) => {
  if (error) {
    console.log(error);
  }
});

const cexAssetSchema = new mongoose.Schema({
  keyIdentifier: String,
  cexName: String,
  name: String,
  symbol: String,
  logo: String,
  balance: Number,
  price: Number,
  value: Number,
});
cexAssetSchema.index({ keyIdentifier: 1, cexName: 1, name: 1, symbol: 1 });

export const cexAssetModel = mongoose.model("cex-asset", cexAssetSchema);
cexAssetModel.on("index", (error) => {
  if (error) {
    console.log(error);
  }
});
