const axios = require("axios");
const {
  addOrUpdateCryptoCurrency,
  getCryptoPriceBySymbol,
} = require("./repository");

const addOrUpdateAllCryptoPriceInUSD = async () => {
  try {
    const response = await axios({
      url: `${process.env.COINGECKO_V3_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc`,
      method: "get",
    });
    let cryptos = [];
    if (response?.data && Array.isArray(response?.data)) {
      const cryptoCurrencies = response?.data;
      for (let i = 0; i < cryptoCurrencies.length; i++) {
        if (cryptoCurrencies[i].symbol && cryptoCurrencies[i].current_price) {
          addOrUpdateCryptoCurrency({
            name: cryptoCurrencies[i].name,
            symbol: cryptoCurrencies[i].symbol,
            price: parseFloat(cryptoCurrencies[i].current_price),
          });
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
};

const getCurrentUSDPrice = async (symbol) => {
  return await getCryptoPriceBySymbol(symbol);
};

module.exports = {
  addOrUpdateAllCryptoPriceInUSD,
  getCurrentUSDPrice
};
