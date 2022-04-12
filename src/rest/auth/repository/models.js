const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  keyIdentifier: {
    type: String,
    required: true,
    unique: true,
  },
  nonce: {
    type: String,
    required: true,
    unique: true,
  },
});
const userModel = mongoose.model("user", userSchema);

module.exports = {
  userModel,
};
