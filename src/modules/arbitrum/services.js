const axios = require("axios");
const { formatBalance, doesImageExists } = require("../../utils");
const { getCurrentUSDPrice } = require("../coingecko");

const getTokenBalancesFromCovalent = async (walletAddress) => {
  const walletInfo = await axios({
    url: `${process.env.COVALENT_V1_API_URL}/${process.env.ARBITRUM_MAINNET_CHAIN_ID}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}&nft=true`,
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
        )?.toFixed(2);

        let price = existingTokens[i]?.quote_rate?.toFixed(2);
        if (!price && existingTokens[i]?.contract_ticker_symbol) {
          price = await getCurrentUSDPrice(
            existingTokens[i].contract_ticker_symbol.toLowerCase()
          );
        }
        const value = (balance * price).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });

        let logo = await doesImageExists(existingTokens[i]?.logo_url);
        if (logo) {
          logo = existingTokens[i]?.logo_url;
        } else {
          logo = "";
        }

        if (price) {
          response.push({
            name: existingTokens[i].contract_name,
            symbol: existingTokens[i].contract_ticker_symbol,
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
