const axios = require("axios");
const crypto = require("crypto");

const {
  getCurrentUSDPrice,
  getFullNameOfTheCurrency,
  getContractAddress,
} = require("../coingecko");

const API_KEY = process.env.KUCOIN_API_KEY;
const API_SECRET = process.env.KUCOIN_API_SECRET;
const API_PASSPHRASE = process.env.KUCOIN_API_PASSPHRASE;
const API_VERSION = process.env.KUCOIN_API_VERSION;
const API_URL = process.env.KUCOIN_API_URL;

const getHoldings = async (type) => {
  const timestamp = Date.now().toString();
  const endpoint = `/api/v1/accounts?type=${type}`;
  const stringToSign = `${timestamp}GET${endpoint}`;
  const signedString = crypto
    .createHmac("sha256", API_SECRET)
    .update(stringToSign)
    .digest("base64");
  const encryptedPassphrase = crypto
    .createHmac("sha256", API_SECRET)
    .update(API_PASSPHRASE)
    .digest("base64");
  try {
    const accountInfo = await axios({
      url: `${API_URL}${endpoint}`,
      method: "GET",
      headers: {
        "KC-API-KEY": API_KEY,
        "KC-API-SIGN": signedString,
        "KC-API-TIMESTAMP": timestamp,
        "KC-API-PASSPHRASE": encryptedPassphrase,
        "KC-API-KEY-VERSION": API_VERSION,
        "Content-Type": "application/json",
      },
    });

    let data = accountInfo?.data?.data;
    const response = [];
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const balance = parseFloat(data[i].holds);
        if (balance > 0) {
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
            usdValue,
            holdingValue: balance * usdValue,
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
  getHoldings,
};
