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
    const usdValue = await getCurrentUSDPrice("btc");
    return {
      balance,
      usdValue,
      holdingValue: balance * usdValue,
    };
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getBitcoinBalance,
};
