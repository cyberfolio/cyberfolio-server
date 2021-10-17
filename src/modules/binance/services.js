const axios = require("axios");
const crypto = require("crypto-js");

const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_API_SECRET;
const API_URL = process.env.BINANCE_API_URL;

const getHoldings = async (type) => {
  const queryString = `type=${type}&timestamp=${Date.now()}`;
  const signature = crypto
    .HmacSHA256(queryString, API_SECRET)
    .toString(crypto.enc.Hex);
  try {
    const response = await axios({
      url: `${API_URL}/sapi/v1/accountSnapshot?${queryString}&signature=${signature}`,
      method: "get",
      headers: {
        "X-MBX-APIKEY": API_KEY,
      },
    });

    let data = response.data;
    let latestSnapshotIndex = 0;
    if (data?.snapshotVos?.length) {
      latestSnapshotIndex = data.snapshotVos.length - 1;
    }
    if (data?.snapshotVos[latestSnapshotIndex]?.data?.balances[0]?.free) {
      const assetsBiggerThanZero = data?.snapshotVos[
        latestSnapshotIndex
      ]?.data?.balances?.filter((asset) => asset.free > 0);
      data = assetsBiggerThanZero;
    }
    return data;
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
