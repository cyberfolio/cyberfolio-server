const axios = require("axios");
const crypto = require("crypto-js");

const {
  getCurrentUSDPrice,
  getFullNameOfTheCurrency,
  getContractAddress,
} = require("../coingecko");

const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_API_SECRET;
const API_URL = process.env.BINANCE_API_URL;

const getHoldings = async (type) => {
  const queryString = `type=${type}&timestamp=${Date.now()}`;
  const signature = crypto
    .HmacSHA256(queryString, API_SECRET)
    .toString(crypto.enc.Hex);
  try {
    const accountInfo = await axios({
      url: `${API_URL}/sapi/v1/accountSnapshot?${queryString}&signature=${signature}`,
      method: "get",
      headers: {
        "X-MBX-APIKEY": API_KEY,
      },
    });

    let data = accountInfo.data;
    let latestSnapshotIndex = 0;
    if (data?.snapshotVos?.length) {
      latestSnapshotIndex = data.snapshotVos.length - 1;
    }
    const latestSnapShot =
      data?.snapshotVos[latestSnapshotIndex]?.data?.balances;
    const response = [];
    if (latestSnapShot && latestSnapShot.length > 0) {
      for (let i = 0; i < latestSnapShot.length; i++) {
        if (parseFloat(latestSnapShot[i].free) > 0) {
          const symbol = latestSnapShot[i].asset.toLowerCase();
          const usdValue = await getCurrentUSDPrice(symbol);
          const name = await getFullNameOfTheCurrency(symbol);
          const contractAddress = await getContractAddress(symbol);
          response.push({
            name,
            symbol,
            type: "cryptocurrency",
            contractAddress,
            balance: parseFloat(latestSnapShot[i].free),
            usdValue,
            holdingValue: parseFloat(latestSnapShot[i].free) * usdValue,
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

const getFiatDepositAndWithDrawalHistory = async (transactionType) => {
  const queryString = `transactionType=${transactionType}&timestamp=${Date.now()}`;
  const signature = crypto
    .HmacSHA256(queryString, API_SECRET)
    .toString(crypto.enc.Hex);
  try {
    const response = await axios({
      url: `${API_URL}/sapi/v1/fiat/orders?${queryString}&signature=${signature}`,
      method: "get",
      headers: {
        "X-MBX-APIKEY": API_KEY,
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

const getFiatPaymentBuyAndSellHistory = async (transactionType) => {
  const queryString = `transactionType=${transactionType}&timestamp=${Date.now()}`;
  const signature = crypto
    .HmacSHA256(queryString, API_SECRET)
    .toString(crypto.enc.Hex);
  try {
    const response = await axios({
      url: `${API_URL}/sapi/v1/fiat/payments?${queryString}&signature=${signature}`,
      method: "get",
      headers: {
        "X-MBX-APIKEY": API_KEY,
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
  getHoldings,
  getFiatDepositAndWithDrawalHistory,
  getFiatPaymentBuyAndSellHistory,
};
