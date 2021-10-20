const axios = require("axios");
const { formatBalance } = require("../../utils");
const { getCurrentUSDPrice } = require("../coingecko");

const getTokenBalancesFromCovalent = async (walletAddress) => {
  const walletInfo = await axios({
    url: `${process.env.COVALENT_V1_API_URL}/${process.env.AVALANCHE_CCHAIN_ID}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}&nft=true`,
    method: "get",
  });
  let existingTokens = walletInfo?.data?.data?.items;
  const response = [];
  if (existingTokens && Array.isArray(existingTokens)) {
    for (let i = 0; i < existingTokens.length; i++) {
      if (existingTokens[i].balance > 0) {
        const balance = formatBalance(
          existingTokens[i].balance,
          parseInt(existingTokens[i].contract_decimals)
        );
        const currentUSDPrice = await getCurrentUSDPrice(
          existingTokens[i].contract_ticker_symbol.toLowerCase()
        );
        if (currentUSDPrice) {
          response.push({
            name: existingTokens[i].contract_name,
            symbol: existingTokens[i].contract_ticker_symbol,
            contractAddress: existingTokens[i].contract_address,
            type: existingTokens[i].type,
            balance: parseFloat(balance),
            usdValue: currentUSDPrice,
          });
        }
      }
    }
  }
  return response;
};

module.exports = {
  getTokenBalancesFromCovalent,
};
