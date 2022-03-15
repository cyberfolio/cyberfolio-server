const mongoose = require("mongoose");

const walletSchema = mongoose.Schema({
  keyIdentifier: String,
  walletAddress: String,
  walletName: String,
  chain: String,
});
const walletsModel = mongoose.model("wallet", walletSchema);

module.exports = {
  walletsModel,
};
