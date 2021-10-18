const axios = require("axios");
const { formatBalance } = require("../../utils");
const { getCurrentUSDPrice } = require("../coingecko");

const getARC20Balances = async (walletAddress) => {
  const avalancheData = await axios({
    url: `${process.env.COVALENT_V1_API_URL}/${process.env.AVALANCHE_CCHAIN_ID}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}&nft=true`,
    method: "get",
  });
  let existingARC20s = avalancheData?.data?.data?.items;
  const response = [];
  if (existingARC20s && Array.isArray(existingARC20s)) {
    for (let i = 0; i < existingARC20s.length; i++) {
      if (existingARC20s[i].balance > 0) {
        const balance = formatBalance(
          existingARC20s[i].balance,
          parseInt(existingARC20s[i].contract_decimals)
        );
        const currentUSDPrice = await getCurrentUSDPrice(
          existingARC20s[i].contract_ticker_symbol.toLowerCase()
        );
        if (currentUSDPrice) {
          response.push({
            name: existingARC20s[i].contract_name,
            symbol: existingARC20s[i].contract_ticker_symbol,
            contractAddress: existingARC20s[i].contract_address,
            balance,
            usdValue: currentUSDPrice,
          });
        }
      }
    }
  }
  return response;
};

module.exports = {
  getARC20Balances,
};
