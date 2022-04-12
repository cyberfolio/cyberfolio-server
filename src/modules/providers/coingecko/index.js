const axios = require("axios");
const {
  addOrUpdateCryptoCurrency,
  getCryptoPriceBySymbol,
  setLastCurrencyUpdateDate,
  getLastCurrencyUpdateDate,
  getFullNameOfTheCurrencyBySymbol,
  getContractAddressOfTheCurrencyBySymbol,
} = require("./repository");

const addOrUpdateAllCryptoPriceInUSD = async (page) => {
  try {
    const response = await axios({
      url: `${process.env.COINGECKO_V3_API_URL}/coins/markets?vs_currency=usd&page=${page}`,
      method: "get",
    });
    if (response?.data && Array.isArray(response?.data)) {
      const cryptoCurrencies = response?.data;
      for (let i = 0; i < cryptoCurrencies.length; i++) {
        if (cryptoCurrencies[i].symbol && cryptoCurrencies[i].current_price) {
          addOrUpdateCryptoCurrency({
            name: cryptoCurrencies[i].name,
            symbol: cryptoCurrencies[i].symbol?.toLowerCase(),
            price: parseFloat(cryptoCurrencies[i].current_price),
            image: cryptoCurrencies[i].image,
          });
        }
      }
    }
    await setLastCurrencyUpdateDate(new Date());
  } catch (e) {
    throw new Error(e);
  }
};

const getCurrentUSDPrice = async (symbol) => {
  return await getCryptoPriceBySymbol(symbol);
};

const getFullNameOfTheCurrency = async (symbol) => {
  return await getFullNameOfTheCurrencyBySymbol(symbol);
};

const getLastCurrencyUpdate = async () => {
  return await getLastCurrencyUpdateDate();
};

const getContractAddress = async (symbol) => {
  return await getContractAddressOfTheCurrencyBySymbol(symbol);
};

module.exports = {
  addOrUpdateAllCryptoPriceInUSD,
  getCurrentUSDPrice,
  getLastCurrencyUpdate,
  getFullNameOfTheCurrency,
  getContractAddress,
};
