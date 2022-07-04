import { Document } from "mongodb";
import mongoose from "mongoose";

export interface User {
  keyIdentifier: string;
  nonce: string;
  ensName?: string;
  lastAssetUpdate?: string;
}

export interface UserDoc extends User, Document {}

const userSchema = new mongoose.Schema<User>({
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
  lastAssetUpdate: {
    type: Date,
    required: false,
  },
});

export const userModel = mongoose.model<User>("user", userSchema);
