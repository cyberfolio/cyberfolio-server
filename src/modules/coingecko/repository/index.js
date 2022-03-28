const { currencyModel, lastCurrencyUpdateModel } = require("./models");

const addOrUpdateCryptoCurrency = async ({ name, symbol, price, image }) => {
  if (name && symbol && price) {
    try {
      await currencyModel.findOneAndUpdate(
        { name },
        {
          name,
          symbol,
          price,
          logo: image ? image : "",
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

const getFullNameOfTheCurrencyBySymbol = async (symbol) => {
  try {
    const currency = await currencyModel.findOne({ symbol });
    return currency?.name ? currency.name : "";
  } catch (e) {
    throw new Error(e);
  }
};

const getContractAddressOfTheCurrencyBySymbol = async (symbol) => {
  try {
    const currency = await currencyModel.findOne({ symbol });
    return currency?.contractAddress ? currency.contractAddress : "";
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
  getFullNameOfTheCurrencyBySymbol,
  getContractAddressOfTheCurrencyBySymbol,
};
