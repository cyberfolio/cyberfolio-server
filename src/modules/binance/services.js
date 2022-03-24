const axios = require("axios");
const crypto = require("crypto-js");

const {
  getCurrentUSDPrice,
  getFullNameOfTheCurrency,
  getContractAddress,
} = require("../coingecko");

const API_URL = process.env.BINANCE_API_URL;

const getAssetsAtSpot = async ({ apiKey, apiSecret }) => {
  const queryString = `timestamp=${Date.now()}`;
  const signature = crypto
    .HmacSHA256(queryString, apiSecret)
    .toString(crypto.enc.Hex);
  try {
    const accountInfo = await axios({
      url: `${API_URL}/api/v3/account?${queryString}&signature=${signature}`,
      method: "get",
      headers: {
        "X-MBX-APIKEY": apiKey,
      },
    });
    let balances = accountInfo?.data?.balances.filter((balance) => {
      if (Number(balance.free) > 0) {
        return balance;
      }
    });

    const response = [];
    if (Array.isArray(balances) && balances.length > 0) {
      for (let i = 0; i < balances.length; i++) {
        const symbol = balances[i].asset.toLowerCase();
        const price = await getCurrentUSDPrice(symbol);
        const name = await getFullNameOfTheCurrency(symbol);
        const contractAddress = await getContractAddress(symbol);
        response.push({
          name,
          symbol,
          type: "cryptocurrency",
          contractAddress,
          balance: parseFloat(balances[i].free),
          price,
          value: parseFloat(balances[i].free) * price,
          cexName: "binance",
        });
      }
    }
    return response;
  } catch (e) {
    if (e?.response?.data?.msg) {
      throw new Error(e.response.data.msg);
    } else {
      throw new Error(e.message);
    }
  }
};

const getFiatDepositAndWithDrawalHistory = async ({
  transactionType,
  apiKey,
  apiSecret,
}) => {
  const queryString = `transactionType=${transactionType}&timestamp=${Date.now()}`;
  const signature = crypto
    .HmacSHA256(queryString, apiSecret)
    .toString(crypto.enc.Hex);
  try {
    const response = await axios({
      url: `${API_URL}/sapi/v1/fiat/orders?${queryString}&signature=${signature}`,
      method: "get",
      headers: {
        "X-MBX-APIKEY": apiKey,
      },
    });

    let data = response.data;
    return data;
  } catch (e) {
    if (e?.response?.data?.code) {
      throw new Error(e.response.data.code);
    } else {
      throw new Error(e.message);
    }
  }
};

const getFiatPaymentBuyAndSellHistory = async ({
  transactionType,
  apiKey,
  apiSecret,
}) => {
  const queryString = `transactionType=${transactionType}&timestamp=${Date.now()}`;
  const signature = crypto
    .HmacSHA256(queryString, apiSecret)
    .toString(crypto.enc.Hex);
  try {
    const response = await axios({
      url: `${API_URL}/sapi/v1/fiat/payments?${queryString}&signature=${signature}`,
      method: "get",
      headers: {
        "X-MBX-APIKEY": apiKey,
      },
    });

    let data = response.data;
    return data;
  } catch (e) {
    if (e?.response?.data?.code) {
      throw new Error(e.response.data.code);
    } else {
      throw new Error(e.message);
    }
  }
};

module.exports = {
  getAssetsAtSpot,
  getFiatDepositAndWithDrawalHistory,
  getFiatPaymentBuyAndSellHistory,
};
