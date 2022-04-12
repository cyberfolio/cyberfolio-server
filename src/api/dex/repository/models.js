const mongoose = require("mongoose");

const walletSchema = mongoose.Schema({
  keyIdentifier: String,
  walletAddress: String,
  walletName: String,
  chain: String,
});
const walletsModel = mongoose.model("wallet", walletSchema);

const dexAssetSchema = mongoose.Schema({
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
const dexAssetModel = mongoose.model("dex-asset", dexAssetSchema);

module.exports = {
  walletsModel,
  dexAssetModel,
};
