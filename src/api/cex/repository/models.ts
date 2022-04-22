import mongoose from 'mongoose'

interface CexInfo {
  keyIdentifier: string
  apiKey: string
  apiSecret: string
  cexName: string
  passphrase: string
}
const cexInfoSchema = new mongoose.Schema<CexInfo>({
  keyIdentifier: String,
  apiKey: String,
  apiSecret: String,
  cexName: String,
  passphrase: String,
})
cexInfoSchema.index({ keyIdentifier: 1, cexName: 1 })
export const cexInfoModel = mongoose.model<CexInfo>('cex-info', cexInfoSchema)
cexInfoModel.on('index', (error) => {
  if (error) {
    console.log(error)
  }
})

interface CexAsset {
  keyIdentifier: string
  cexName: string
  name: string
  symbol: string
  logo: string
  balance: number
  price: number
  value: number
}
const cexAssetSchema = new mongoose.Schema<CexAsset>({
  keyIdentifier: String,
  cexName: String,
  name: String,
  symbol: String,
  logo: String,
  balance: Number,
  price: Number,
  value: Number,
})
cexAssetSchema.index({ keyIdentifier: 1, cexName: 1, name: 1, symbol: 1 })
export const cexAssetModel = mongoose.model<CexAsset>(
  'cex-asset',
  cexAssetSchema,
)
cexAssetModel.on('index', (error) => {
  if (error) {
    console.log(error)
  }
})
