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
userSchema.index({ keyIdentifier: 1, nonce: 1 });

const userModel = mongoose.model("user", userSchema);
userModel.on("index", (error) => {
  if (error) {
    console.log(error);
  }
});

module.exports = {
  userModel,
};
