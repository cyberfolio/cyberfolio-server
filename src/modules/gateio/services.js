const GateApi = require("gate-api");

const {
  getCurrentUSDPrice,
  getFullNameOfTheCurrency,
  getContractAddress,
} = require("../coingecko");

const API_KEY = process.env.GATEIO_API_KEY;
const API_SECRET = process.env.GATEIO_API_SECRET;

const getHoldingsSpot = async () => {
  const client = new GateApi.ApiClient();
  client.setApiKeySecret(API_KEY, API_SECRET);

  const spotApi = new GateApi.SpotApi(client);
  try {
    const accounts = await spotApi.listSpotAccounts();

    let data = accounts?.body;
    const response = [];
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const balance = parseFloat(data[i]?.available);
        const locked = parseFloat(data[i]?.locked);
        if (balance > 0.5 || locked > 0.5) {
          const symbol = data[i].currency.toLowerCase();
          const usdValue = await getCurrentUSDPrice(symbol);
          const name = await getFullNameOfTheCurrency(symbol);
          const contractAddress = await getContractAddress(symbol);
          response.push({
            name,
            symbol,
            type: "cryptocurrency",
            contractAddress,
            balance,
            locked,
            usdValue,
            holdingValue: balance * usdValue + locked * usdValue,
          });
        }
      }
    }

    return response;
  } catch (e) {
    if (e?.response?.data?.code) {
      throw new Error(e.response.data.code);
    } else {
      throw new Error(e.message);
    }
  }
};

const getHoldingsMargin = async () => {
  const client = new GateApi.ApiClient();
  client.setApiKeySecret(API_KEY, API_SECRET);

  const marginApi = new GateApi.MarginApi(client);
  try {
    const accounts = await marginApi.listMarginAccounts();
    let data = accounts?.body;
    const response = [];
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const balance = parseFloat(data[i]?.available);
        const locked = parseFloat(data[i]?.locked);
        if (balance > 0.5 || locked > 0.5) {
          const symbol = data[i].currency.toLowerCase();
          const usdValue = await getCurrentUSDPrice(symbol);
          const name = await getFullNameOfTheCurrency(symbol);
          const contractAddress = await getContractAddress(symbol);
          response.push({
            name,
            symbol,
            type: "cryptocurrency",
            contractAddress,
            balance,
            locked,
            usdValue,
            holdingValue: balance * usdValue + locked * usdValue,
          });
        }
      }
    }

    return response;
  } catch (e) {
    if (e?.response?.data?.code) {
      throw new Error(e.response.data.code);
    } else {
      throw new Error(e.message);
    }
  }
};

module.exports = {
  getHoldingsSpot,
  getHoldingsMargin,
};
