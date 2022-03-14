const mongoose = require("mongoose");

const evmWalletSchema = mongoose.Schema({
  keyIdentifier: String,
  walletAddress: String,
  walletName: String,
  chain: String,
});
const evmWalletsModel = mongoose.model("ewm-wallet", evmWalletSchema);

module.exports = {
  evmWalletsModel,
};
