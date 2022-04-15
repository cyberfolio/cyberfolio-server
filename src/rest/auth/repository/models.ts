import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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

export const userModel = mongoose.model("user", userSchema);
userModel.on("index", (error) => {
  if (error) {
    console.log(error);
  }
});
