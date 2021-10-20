const axios = require("axios");
const { formatBalance } = require("../../utils");

const getTokenBalancesFromCovalent = async (walletAddress) => {
  const walletInfo = await axios({
    url: `${process.env.COVALENT_V1_API_URL}/${process.env.SMARTCHAIN_CHAIN_ID}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}&nft=true`,
    method: "get",
  });
  let existingTokens = walletInfo?.data?.data?.items;
  const response = [];
  if (existingTokens && Array.isArray(existingTokens)) {
    for (let i = 0; i < existingTokens.length; i++) {
      if (existingTokens[i].balance > 0) {
        const balance = parseFloat(
          formatBalance(
            existingTokens[i].balance,
            parseInt(existingTokens[i].contract_decimals)
          )
        );
        const usdValue = existingTokens[i].quote_rate;
        if (usdValue) {
          response.push({
            name: existingTokens[i].contract_name,
            symbol: existingTokens[i].contract_ticker_symbol,
            contractAddress: existingTokens[i].contract_address,
            type: existingTokens[i].type,
            balance,
            usdValue,
            holdingValue: balance * usdValue,
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
