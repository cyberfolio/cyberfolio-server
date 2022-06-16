import mongoose from "mongoose";

const currencySchema = new mongoose.Schema({
  name: String,
  symbol: String,
  contractAddress: String,
  price: Number,
  logo: String,
});
export const currencyModel = mongoose.model("currency", currencySchema);

const lastCurrencyUpdateSchema = new mongoose.Schema({
  id: Number,
  lastUpdateDate: Date,
});
export const lastCurrencyUpdateModel = mongoose.model("last-currency-update", lastCurrencyUpdateSchema);
