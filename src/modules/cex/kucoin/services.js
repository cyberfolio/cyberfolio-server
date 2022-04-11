const axios = require("axios");
const crypto = require("crypto-js");
const { roundNumber } = require("../../../utils");

const {
  getCurrentUSDPrice,
  getFullNameOfTheCurrency,
  getContractAddress,
} = require("../../coingecko");
const { getCryptoCurrencyLogo } = require("../../coinmarketcap");

const API_VERSION = process.env.KUCOIN_API_VERSION;
const API_URL = process.env.KUCOIN_API_URL;

const getAssets = async ({ type, apiKey, apiSecret, passphrase }) => {
  const timestamp = Date.now().toString();
  const endpoint = `/api/v1/accounts?type=${type}`;
  const stringToSign = `${timestamp}GET${endpoint}`;
  const signedString = crypto
    .HmacSHA256(stringToSign, apiSecret)
    .toString(crypto.enc.Base64);

  const encryptedApiVersion = crypto
    .HmacSHA256(API_VERSION, apiSecret)
    .toString(crypto.enc.Base64);

  try {
    const accountInfo = await axios({
      url: `${API_URL}${endpoint}`,
      method: "GET",
      headers: {
        "KC-API-KEY": apiKey,
        "KC-API-SIGN": signedString,
        "KC-API-TIMESTAMP": timestamp,
        "KC-API-PASSPHRASE": passphrase,
        "KC-API-KEY-VERSION": encryptedApiVersion,
      },
    });

    let data = accountInfo?.data?.data;
    const response = [];
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const balance = parseFloat(data[i].holds);
        if (balance > 0) {
          const symbol = data[i].currency?.toLowerCase();
          const price = await getCurrentUSDPrice(symbol);
          const name = await getFullNameOfTheCurrency(symbol);
          const contractAddress = await getContractAddress(symbol);
          const value = roundNumber(balance * price);
          const logo = await getCryptoCurrencyLogo({
            symbol,
          });
          response.push({
            name,
            symbol,
            type: "cryptocurrency",
            contractAddress,
            balance,
            price,
            value,
            logo,
            cexName: "kucoin",
          });
        }
      }
    }

    return response;
  } catch (e) {
    if (e.response?.data?.code === "400003") {
      throw new Error("Api key or secret is not valid.");
    } else if (e?.response?.data?.code === "400005") {
      throw new Error("Server error, please contact the admin.");
    } else {
      console.log(e.response);
      throw new Error(e.message);
    }
  }
};

module.exports = {
  getAssets,
};
