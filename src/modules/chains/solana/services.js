const { Connection, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const axios = require("axios");
const { TokenListProvider } = require("@solana/spl-token-registry");
const { intDivide } = require("../../../utils");
const { getCurrentUSDPrice } = require("../../providers/coingecko");

const getTokenBalances = async (walletAddress) => {
  try {
    const connection = new Connection(
      clusterApiUrl(process.env.SOLANA_ENVIRONMET),
      "confirmed"
    );
    const base58publicKey = new PublicKey(walletAddress);

    const solanaBalance = await connection.getBalance(base58publicKey);
    const formattedSolanaBalance = solanaBalance / process.env.SOLANA_DECIMALS;

    const tokens = await new TokenListProvider().resolve();
    const tokenList = tokens
      .filterByClusterSlug(process.env.SOLANA_ENVIRONMET)
      .getList();

    const avaliableTokens = [];
    const solanaUsdValue = await getCurrentUSDPrice("sol");
    avaliableTokens.push({
      name: "Solana",
      symbol: "sol",
      balance: formattedSolanaBalance,
      usdValue: solanaUsdValue * formattedSolanaBalance,
    });
    const otherBalalnces = await getBalances(walletAddress, tokenList);
    avaliableTokens.push(...otherBalalnces);

    return avaliableTokens;
  } catch (e) {
    throw new Error(e);
  }
};

const getBalances = async (walletAddress, tokens) => {
  const response = [];
  const eachIterationCount = 200;
  const iterations = intDivide(tokens.length, eachIterationCount);
  const resOfTheTokens = tokens.length % eachIterationCount;
  let start = 0;
  let request = [];
  let tokensInfo = [];

  for (let iteration = 1; iteration <= iterations; iteration++) {
    for (let i = start; i < eachIterationCount * iteration; i++) {
      request.push({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountsByOwner",
        params: [
          walletAddress,
          {
            mint: tokens[i].address,
          },
          {
            encoding: "jsonParsed",
          },
        ],
      });
      tokensInfo.push({
        name: tokens[i].name,
        symbol: tokens[i].symbol,
        logoURI: tokens[i].logoURI,
        address: tokens[i].address,
      });
    }

    const solanaResponse = await axios({
      url: `${process.env.SOLANA_RPC_ENDPOINT}`,
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: [...request],
    });

    for (let data = 0; data < solanaResponse.data.length; data++) {
      if (
        Array.isArray(solanaResponse.data[data]?.result?.value) &&
        solanaResponse.data[data]?.result?.value?.length > 0 &&
        solanaResponse.data[data]?.result?.value[0]?.account?.data?.parsed?.info
          ?.tokenAmount?.amount > 0
      ) {
        const usdValue = await getCurrentUSDPrice(
          tokensInfo[data].symbol?.toLowerCase()
        );
        const balance =
          Number(
            solanaResponse.data[data]?.result?.value[0]?.account?.data?.parsed
              ?.info?.tokenAmount?.amount
          ) / process.env.SOLANA_DECIMALS;
        response.push({
          name: tokensInfo[data].name,
          symbol: tokensInfo[data].symbol,
          logoURI: tokensInfo[data].logoURI,
          address: tokensInfo[data].address,
          balance,
          usdValue: balance * usdValue,
        });
      }
    }
    start += eachIterationCount;
    request = [];
    tokensInfo = [];
  }
  for (let i = start; i < start + resOfTheTokens; i++) {
    request.push({
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenAccountsByOwner",
      params: [
        walletAddress,
        {
          mint: tokens[i].address,
        },
        {
          encoding: "jsonParsed",
        },
      ],
    });
    tokensInfo.push({
      name: tokens[i].name,
      symbol: tokens[i].symbol,
      logoURI: tokens[i].logoURI,
      address: tokens[i].address,
    });
  }

  const solanaResponse = await axios({
    url: `${process.env.SOLANA_RPC_ENDPOINT}`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: [...request],
  });

  for (let data = 0; data < solanaResponse.data.length; data++) {
    if (
      Array.isArray(solanaResponse.data[data]?.result?.value) &&
      solanaResponse.data[data]?.result?.value?.length > 0 &&
      solanaResponse.data[data]?.result?.value[0]?.account?.data?.parsed?.info
        ?.tokenAmount?.amount > 0
    ) {
      const usdValue = await getCurrentUSDPrice(
        tokensInfo[data].symbol?.toLowerCase()
      );
      response.push({
        name: tokensInfo[data].name,
        symbol: tokensInfo[data].symbol,
        logoURI: tokensInfo[data].logoURI,
        address: tokensInfo[data].address,
        balance:
          Number(
            solanaResponse.data[data]?.result?.value[0]?.account?.data?.parsed
              ?.info?.tokenAmount?.amount
          ) / process.env.SOLANA_DECIMALS,
        usdValue,
        chain: "solana",
      });
    }
  }

  return response;
};

module.exports = {
  getTokenBalances,
};
