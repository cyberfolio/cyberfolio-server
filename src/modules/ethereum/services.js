const Web3 = require("web3");
const axios = require("axios");

const { getCurrentUSDPrice } = require("../coingecko");

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
  if (!walletAddress) {
    throw new Error("Please provide eth address");
  }
  if (!isValidEthAddress(walletAddress)) {
    throw new Error("Eth address is invalid");
  }
  try {
    const balance = await web3.eth.getBalance(walletAddress);
    return web3.utils.fromWei(balance, "ether");
  } catch (e) {
    throw new Error(e);
  }
};

const getERC20Balances = async (walletAddress) => {
  if (!walletAddress) {
    throw new Error("Please provide eth address");
  }
  if (!isValidEthAddress(walletAddress)) {
    throw new Error("Eth address is invalid");
  }
  const abi = [
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "balance", type: "uint256" }],
      type: "function",
    },
  ];
  const tokens = getERC20Tokens();
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
        console.log("Token Address: " + tokens[i].address);
        console.log("Error message: " + e.message);
        continue;
      }
    }
  }

  existingTokens = existingTokens.filter(
    (existingToken) => existingToken.balance > 0
  );

  for (let i = 0; i < existingTokens.length; i++) {
    if (existingTokens[i].symbol) {
      try {
        const price = await getCurrentUSDPrice(
          existingTokens[i].symbol.toLowerCase()
        );
        console.log(price);
        existingTokens[i].usdValue = price;
      } catch (e) {
        console.log("Token Address: " + existingTokens[i].contractAddress);
        console.log("Error message: " + e.message);
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

module.exports = {
  getEthBalance,
  getERC20Balances,
};
