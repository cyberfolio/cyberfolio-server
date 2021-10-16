const Web3 = require("web3");
const axios = require("axios");

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
  try {
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
    const existingTokens = [];
    for (let i = 0; i < tokens.length; i++) {
      try {
        const contract = new web3.eth.Contract(abi, tokens[i].address);
        const tokenBalance = await contract.methods
          .balanceOf(walletAddress)
          .call();
        const formattedBalance = web3.utils.fromWei(tokenBalance, "ether");
        const existingToken = {
          balance: formattedBalance,
          symbol: tokens[i].symbol,
        };
        console.log(existingToken);
        existingTokens.push(existingToken);
      } catch (e) {
        console.log(e);
        continue;
      }
    }
    existingTokens = existingTokens.filter((existingToken) => {
      return existingToken.balance > 0;
    });
    return existingTokens;
  } catch (e) {
    throw new Error(e);
  }
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
