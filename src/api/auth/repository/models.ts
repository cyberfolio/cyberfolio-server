import mongoose from "mongoose";

interface UserDoc {
  keyIdentifier: string;
  nonce: string;
  firstTimeLogin: boolean;
  ensName?: string;
  lastAssetUpdate?: string;
}

const userSchema = new mongoose.Schema<UserDoc>({
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
  ensName: {
    type: String,
  },
  firstTimeLogin: {
    type: Boolean,
    required: true,
  },
  lastAssetUpdate: {
    type: Date,
    required: false,
  },
});

export const userModel = mongoose.model<UserDoc>("user", userSchema);
