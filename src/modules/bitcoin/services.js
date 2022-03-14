const axios = require("axios");

const { sathoshiToBtcBalance } = require("../../utils");
const { getCurrentUSDPrice } = require("../coingecko");

const getBitcoinBalance = async (walletAddress) => {
  try {
    const { data } = await axios({
      url: `${process.env.BLOCKCHAIN_INFO_API_URL}/q/addressbalance/${walletAddress}`,
      method: "get",
    });
    const balance = sathoshiToBtcBalance(data);
    const price = await getCurrentUSDPrice("btc");
    return {
      name: "Bitcoin",
      balance,
      price,
      value: (balance * price).toFixed(2),
      chain: "Bitcoin",
    };
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getBitcoinBalance,
};
