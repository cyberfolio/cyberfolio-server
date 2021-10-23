const { Connection, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const axios = require("axios");
const { TokenListProvider } = require("@solana/spl-token-registry");
const { sleep } = require("../../utils");

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
    for (const token of tokenList) {
      if (token.address === "E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp") {
        const aaa = await getTokenBalance(walletAddress, token.address);
        if (aaa > 0) {
          console.log(aaa);
          console.log(token.name);
        }
      }
    }

    return {
      balalnce: formattedSolanaBalance,
    };
  } catch (e) {
    throw new Error(e);
  }
};

const getTokenBalance = async (walletAddress, tokenMintAddress) => {
  const response = await axios({
    url: `${process.env.SOLANA_RPC_ENDPOINT}`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: {
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenAccountsByOwner",
      params: [
        walletAddress,
        {
          mint: tokenMintAddress,
        },
        {
          encoding: "jsonParsed",
        },
      ],
    },
  });
  await sleep(1000);
  console.log(JSON.stringify(response?.data?.result, null, 2));
  if (
    Array.isArray(response?.data?.result?.value) &&
    response?.data?.result?.value?.length > 0 &&
    response?.data?.result?.value[0]?.account?.data?.parsed?.info?.tokenAmount
      ?.amount > 0
  ) {
    return (
      Number(
        response?.data?.result?.value[0]?.account?.data?.parsed?.info
          ?.tokenAmount?.amount
      ) / process.env.SOLANA_DECIMALS
    );
  } else {
    return 0;
  }
};

module.exports = {
  getTokenBalances,
};
