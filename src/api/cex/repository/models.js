const mongoose = require("mongoose");

const cexSchema = mongoose.Schema({
  keyIdentifier: String,
  apiKey: String,
  apiSecret: String,
  cexName: String,
});
const cexInfoModel = mongoose.model("cex-info", cexSchema);

const cexHoldingSchema = mongoose.Schema({
  keyIdentifier: String,
  cexName: String,
  name: String,
  symbol: String,
  balance: Number,
  price: Number,
  value: Number,
});
const cexAssetModel = mongoose.model("cex-asset", cexHoldingSchema);

module.exports = {
  cexInfoModel,
  cexAssetModel,
};
