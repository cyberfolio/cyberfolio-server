const axios = require("axios");

const getCryptoCurrencyLogo = async ({ symbol }) => {
  try {
    const response = await axios({
      url: `${process.env.COINMARKETCAP_API_URL}/cryptocurrency/info?symbol=${symbol}`,
      method: "get",
      headers: {
        "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
      },
    });

    if (Array.isArray(response?.data?.data[symbol.toUpperCase()])) {
      return response?.data?.data[symbol.toUpperCase()][0]?.logo;
    }
    return response?.data?.data?.logo;
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = {
  getCryptoCurrencyLogo,
};
