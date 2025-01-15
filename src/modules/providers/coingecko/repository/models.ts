import mongoose from 'mongoose';

const currencySchema = new mongoose.Schema({
  name: String,
  symbol: String,
  contractAddress: String,
  price: Number,
  logo: String,
});
export const currencyModel = mongoose.model('currency', currencySchema);

interface LastCurrencyUpdateDoc {
  id: number;
  lastUpdateDate: Date;
}

const lastCurrencyUpdateSchema = new mongoose.Schema<LastCurrencyUpdateDoc>({
  id: Number,
  lastUpdateDate: Date,
});

export const lastCurrencyUpdateModel =
  (mongoose.models.LastCurrencyUpdateDoc as mongoose.Model<LastCurrencyUpdateDoc>) ||
  mongoose.model<LastCurrencyUpdateDoc>('last-currency-update', lastCurrencyUpdateSchema);
