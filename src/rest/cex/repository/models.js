const mongoose = require("mongoose");

const cexSchema = mongoose.Schema({
  keyIdentifier: String,
  apiKey: String,
  apiSecret: String,
  cexName: String,
  passphrase: String,
});
const cexInfoModel = mongoose.model("cex-info", cexSchema);

const cexAssetSchema = mongoose.Schema({
  keyIdentifier: String,
  cexName: String,
  name: String,
  symbol: String,
  logo: String,
  balance: Number,
  price: Number,
  value: Number,
});
const cexAssetModel = mongoose.model("cex-asset", cexAssetSchema);

module.exports = {
  cexInfoModel,
  cexAssetModel,
};
