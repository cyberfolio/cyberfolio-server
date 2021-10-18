const { currencyModel, lastCurrencyUpdateModel } = require("./models");

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
    return currency?.price ? parseFloat(currency.price.toFixed(2)) : null;
  } catch (e) {
    throw new Error(e);
  }
};

const setLastCurrencyUpdateDate = async (lastUpdateDate) => {
  try {
    await lastCurrencyUpdateModel.findOneAndUpdate(
      { id: 1 },
      { lastUpdateDate },
      { upsert: true }
    );
  } catch (e) {
    throw new Error(e);
  }
};

const getLastCurrencyUpdateDate = async () => {
  try {
    const lastCurrencyUpdate = await lastCurrencyUpdateModel.findOne({ id: 1 });
    return lastCurrencyUpdate?.lastUpdateDate;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  addOrUpdateCryptoCurrency,
  getCryptoPriceBySymbol,
  setLastCurrencyUpdateDate,
  getLastCurrencyUpdateDate,
};
