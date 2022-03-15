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
    const value = (balance * price).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    return {
      name: "Bitcoin",
      balance,
      price,
      value,
      chain: "Bitcoin",
    };
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getBitcoinBalance,
};
