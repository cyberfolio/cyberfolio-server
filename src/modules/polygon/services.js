const axios = require("axios");
const { formatBalance } = require("../../utils");
const { getCryptoCurrencyLogo } = require("../coinmarketcap");

const getTokenBalancesFromCovalent = async (walletAddress) => {
  const walletInfo = await axios({
    url: `${process.env.COVALENT_V1_API_URL}/${process.env.POLYGON_CHAIN_ID}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}&nft=true`,
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
        )
          ?.toFixed(2)
          .toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          });
        const value = (balance * price).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });

        const price = existingTokens[i]?.quote_rate?.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
        const symbol = existingTokens[i].contract_ticker_symbol;
        const logo = await getCryptoCurrencyLogo({
          symbol,
        });

        if (price && symbol) {
          response.push({
            name: existingTokens[i].contract_name,
            symbol,
            contractAddress: existingTokens[i].contract_address,
            type: existingTokens[i].type,
            logo,
            balance,
            price,
            value,
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
