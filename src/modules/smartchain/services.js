const axios = require("axios");
const { formatBalance } = require("../../utils");
const { getCurrentUSDPrice } = require("../coingecko");

const getBEP20Balances = async (walletAddress) => {
  const avalancheData = await axios({
    url: `${process.env.COVALENT_V1_API_URL}/${process.env.SMARTCHAIN_CHAIN_ID}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`,
    method: "get",
  });
  let existingBEP20s = avalancheData?.data?.data?.items;
  const response = [];
  if (existingBEP20s && Array.isArray(existingBEP20s)) {
    for (let i = 0; i < existingBEP20s.length; i++) {
      if (existingBEP20s[i].balance > 0) {
        const balance = formatBalance(existingBEP20s[i].balance);
        const currentUSDPrice = await getCurrentUSDPrice(
          existingBEP20s[i].contract_ticker_symbol.toLowerCase()
        );
        if (currentUSDPrice) {
          response.push({
            name: existingBEP20s[i].contract_name,
            symbol: existingBEP20s[i].contract_ticker_symbol,
            contractAddress: existingBEP20s[i].contract_address,
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
  getBEP20Balances,
};
