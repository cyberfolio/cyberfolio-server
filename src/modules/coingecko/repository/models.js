const mongoose = require("mongoose");

const currencySchema = mongoose.Schema({
  name: String,
  symbol: String,
  price: Number,
});

const currencyModel = mongoose.model("currency", currencySchema);

module.exports = {
  currencyModel,
};
