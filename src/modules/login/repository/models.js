const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  evmAddress: String,
  nonce: String,
});
const userModel = mongoose.model("user", userSchema);

module.exports = {
  userModel,
};
