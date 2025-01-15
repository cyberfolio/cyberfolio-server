import mongoose from 'mongoose';

interface ScamToken {
  address: string;
  chainId: string;
}

const scamTokenSchema = new mongoose.Schema<ScamToken>({
  address: {
    type: String,
    required: true,
  },
  chainId: {
    type: String,
    required: true,
  },
});

const scamTokenModel =
  (mongoose.models.DexAsset as mongoose.Model<ScamToken>) || mongoose.model<ScamToken>('scam-token', scamTokenSchema);

export default scamTokenModel;
