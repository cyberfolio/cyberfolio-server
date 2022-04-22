import mongoose from 'mongoose'

interface Wallet {
  keyIdentifier: string
  walletAddress: string
  walletName: string
  chain: string
}
const walletSchema = new mongoose.Schema<Wallet>({
  keyIdentifier: { type: String, required: true },
  walletAddress: { type: String, required: true },
  walletName: { type: String, required: true },
  chain: { type: String, required: true },
})
walletSchema.index({
  keyIdentifier: 1,
  walletAddress: 1,
  walletName: 1,
  chain: 1,
})
export const walletsModel = mongoose.model<Wallet>('wallet', walletSchema)
walletsModel.on('index', (error) => {
  if (error) {
    console.log(error)
  }
})

interface DexAsset {
  keyIdentifier: string
  chain: string
  name: string
  symbol: string
  logo: string
  balance: number
  price: number
  value: number
  walletName: string
  contractAddress: string
}
const dexAssetSchema = new mongoose.Schema<DexAsset>({
  keyIdentifier: { type: String, required: true },
  chain: { type: String, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  logo: { type: String, required: true },
  balance: { type: Number, required: true },
  price: { type: Number, required: true },
  value: { type: Number, required: true },
  walletName: { type: String, required: true },
  contractAddress: { type: String },
})
dexAssetSchema.index({
  keyIdentifier: 1,
  chain: 1,
  name: 1,
  symbol: 1,
})
export const dexAssetModel = mongoose.model<DexAsset>(
  'dex-asset',
  dexAssetSchema,
)
dexAssetModel.on('index', (error) => {
  if (error) {
    console.log(error)
  }
})
