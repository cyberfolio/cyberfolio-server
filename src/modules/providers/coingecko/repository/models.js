const mongoose = require("mongoose");

const currencySchema = mongoose.Schema({
  name: String,
  symbol: String,
  contractAddress: String,
  price: Number,
  logo: String,
});
const currencyModel = mongoose.model("currency", currencySchema);

const lastCurrencyUpdateSchema = mongoose.Schema({
  id: Number,
  lastUpdateDate: Date,
});
const lastCurrencyUpdateModel = mongoose.model(
  "last-currency-update",
  lastCurrencyUpdateSchema
);

module.exports = {
  currencyModel,
  lastCurrencyUpdateModel,
};
