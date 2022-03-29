const Web3 = require("web3");
const axios = require("axios");

const { getCurrentUSDPrice } = require("../coingecko");
const { formatBalance } = require("../../utils");
const { getCryptoCurrencyLogo } = require("../coinmarketcap");

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`
  )
);
const coingeckoERC20TokenListURL = process.env.COINGECKO_ERC20_TOKEN_LIST_URL;

const isValidEthAddress = (address) => {
  return web3.utils.isAddress(address);
};

const getEthBalance = async (walletAddress) => {
  try {
    const balance = await web3.eth.getBalance(walletAddress);
    return web3.utils.fromWei(balance, "ether");
  } catch (e) {
    throw new Error(e);
  }
};

const getERC20Balances = async (walletAddress) => {
  let existingTokens = await getExistingTokensOfWallet(walletAddress);

  existingTokens = existingTokens.filter(
    (existingToken) => existingToken.balance > 0
  );

  for (let i = 0; i < existingTokens.length; i++) {
    if (existingTokens[i].symbol) {
      try {
        const price = await getCurrentUSDPrice(
          existingTokens[i].symbol.toLowerCase()
        );
        existingTokens[i].usdValue = price;
      } catch (e) {
        continue;
      }
    }
  }

  return existingTokens;
};

const getExistingTokensOfWallet = async (walletAddress) => {
  const abi = [
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "balance", type: "uint256" }],
      type: "function",
    },
  ];
  const tokens = await getERC20Tokens();
  let existingTokens = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].address && tokens[i].symbol) {
      try {
        const contract = new web3.eth.Contract(abi, tokens[i].address);
        const tokenBalance = await contract.methods
          .balanceOf(walletAddress)
          .call();
        const formattedBalance = web3.utils.fromWei(tokenBalance, "ether");
        const existingToken = {
          name: tokens[i].name,
          symbol: tokens[i].symbol,
          contractAddress: tokens[i].address,
          balance: parseFloat(formattedBalance),
        };
        existingTokens.push(existingToken);
      } catch (e) {
        continue;
      }
    }
  }
  return existingTokens;
};

const getERC20Tokens = async () => {
  try {
    const response = await axios({
      url: coingeckoERC20TokenListURL,
      method: "get",
    });
    if (response?.data?.tokens) {
      const contracts = response.data.tokens.map((token) => {
        return {
          name: token.name,
          address: token.address,
          symbol: token.symbol,
        };
      });
      return contracts;
    } else {
      return [];
    }
  } catch (e) {
    throw new Error(e);
  }
};

const getTokenBalancesFromCovalent = async (walletAddress) => {
  try {
    const walletInfo = await axios({
      url: `${process.env.COVALENT_V1_API_URL}/${process.env.ETHEREUM_MAINNET_CHAIN_ID}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`,
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

          const price = existingTokens[i]?.quote_rate;
          const value = balance * existingTokens[i]?.quote_rate;

          const name = existingTokens[i].contract_name;
          const symbol = existingTokens[i].contract_ticker_symbol;
          const contractAddress = existingTokens[i].contract_address;
          const logo = await getCryptoCurrencyLogo({
            symbol,
          });

          if (price && symbol) {
            response.push({
              name,
              symbol,
              contractAddress,
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
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  getEthBalance,
  getERC20Balances,
  isValidEthAddress,
  getTokenBalancesFromCovalent,
};
