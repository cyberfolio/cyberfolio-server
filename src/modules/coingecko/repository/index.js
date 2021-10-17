const { currencyModel } = require("./models");

const addOrUpdateCryptoCurrency = async (currency) => {
  if (currency.name && currency.symbol && currency.price) {
    try {
      await currencyModel.findOneAndUpdate(
        { name: currency.name },
        {
          name: currency.name,
          symbol: currency.symbol,
          price: currency.price,
        },
        {
          upsert: true, // creates if none
          timestamps: true,
        }
      );
    } catch (e) {
      throw new Error(e);
    }
  }
};

const getCryptoPriceBySymbol = async (symbol) => {
  try {
    const currency = await currencyModel.findOne({ symbol });
    return currency.price;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  addOrUpdateCryptoCurrency,
  getCryptoPriceBySymbol,
};
