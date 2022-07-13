import axios from "axios";
import { Connection, clusterApiUrl, PublicKey, Cluster } from "@solana/web3.js";
import { TokenInfo, TokenListProvider } from "@solana/spl-token-registry";

import { getFilePath, logError, intDivide } from "@src/utils";
import { getCurrentUSDPrice } from "@providers/coingecko";
import { Chain } from "@config/types";
import { DexAssetAPIResponse } from "@dex/common/types";
import { base58 } from "ethers/lib/utils";

const solanaDecimals = Number(process.env.SOLANA_DECIMALS);
const path = getFilePath(__filename);

export const getTokenBalances = async (walletAddress: string) => {
  try {
    const connection = new Connection(clusterApiUrl(process.env.SOLANA_ENVIRONMET as Cluster), "confirmed");
    const base58WalletAddress = base58.decode(walletAddress);
    const base58publicKey = new PublicKey(base58WalletAddress);

    const solanaBalance = await connection.getBalance(base58publicKey);
    const formattedSolanaBalance = solanaBalance / solanaDecimals;

    const tokens = await new TokenListProvider().resolve();
    const tokenList = tokens.filterByClusterSlug(process.env.SOLANA_ENVIRONMET as Cluster).getList();

    const avaliableTokens: DexAssetAPIResponse[] = [];
    const solanaUsdValue = await getCurrentUSDPrice("sol");
    avaliableTokens.push({
      name: "Solana",
      symbol: "sol",
      balance: formattedSolanaBalance,
      value: solanaUsdValue * formattedSolanaBalance,
      chain: Chain.SOLANA,
      price: solanaUsdValue,
      scan: `https://explorer.solana.com/address/${walletAddress}`,
      contractAddress: "",
      logo: "https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422",
    });
    const splBalances = await getBalances(walletAddress, tokenList);
    avaliableTokens.push(...splBalances);
    return avaliableTokens;
  } catch (e) {
    logError({
      e,
      func: getTokenBalances.name,
      path,
    });
    throw e;
  }
};

const getBalances = async (walletAddress: string, tokens: TokenInfo[]) => {
  try {
    const response: DexAssetAPIResponse[] = [];
    const eachIterationCount = 256;
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

      const solanaResponse = (await axios({
        url: `${process.env.SOLANA_RPC_ENDPOINT}`,
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: [...request],
      })) as any;

      for (let data = 0; data < solanaResponse.data.length; data++) {
        if (
          Array.isArray(solanaResponse.data[data]?.result?.value) &&
          solanaResponse.data[data]?.result?.value?.length > 0 &&
          solanaResponse.data[data]?.result?.value[0]?.account?.data?.parsed?.info?.tokenAmount?.amount > 0
        ) {
          const price = await getCurrentUSDPrice(tokensInfo[data].symbol?.toLowerCase());
          const balance =
            Number(solanaResponse.data[data]?.result?.value[0]?.account?.data?.parsed?.info?.tokenAmount?.amount) /
            solanaDecimals;
          response.push({
            name: String(tokensInfo[data].name),
            symbol: String(tokensInfo[data].symbol),
            logo: String(tokensInfo[data].logoURI),
            contractAddress: String(tokensInfo[data].address),
            balance,
            price,
            chain: Chain.SOLANA,
            scan: `https://explorer.solana.com/address/${walletAddress}/tokens`,
            value: balance * price,
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

    const solanaResponse = (await axios({
      url: `${process.env.SOLANA_RPC_ENDPOINT}`,
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: [...request],
    })) as any;

    for (let i = 0; i < solanaResponse.data.length; i++) {
      if (
        Array.isArray(solanaResponse.data[i]?.result?.value) &&
        solanaResponse.data[i]?.result?.value?.length > 0 &&
        solanaResponse.data[i]?.result?.value[0]?.account?.data?.parsed?.info?.tokenAmount?.amount > 0
      ) {
        const price = await getCurrentUSDPrice(tokensInfo[i].symbol?.toLowerCase());
        const balance =
          Number(solanaResponse.data[i]?.result?.value[0]?.account?.data?.parsed?.info?.tokenAmount?.amount) /
          solanaDecimals;
        response.push({
          name: String(tokensInfo[i].name),
          symbol: String(tokensInfo[i].symbol),
          logo: String(tokensInfo[i].logoURI),
          contractAddress: String(tokensInfo[i].address),
          balance,
          price,
          value: balance * price,
          chain: Chain.SOLANA,
          scan: `https://explorer.solana.com/address/${walletAddress}/tokens`,
        });
      }
    }

    return response;
  } catch (e) {
    logError({
      e,
      func: getTokenBalances.name,
      path,
    });
    throw e;
  }
};

const solana = {
  getTokenBalances,
};

export default solana;
