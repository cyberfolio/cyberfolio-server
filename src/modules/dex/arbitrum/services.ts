import axios from "axios";
import { formatBalance, getFilePath, isScamToken, logError } from "@src/utils";
import { getCurrencyLogo } from "@providers/coingecko/repository";
import { Platform } from "@config/types";
import { EvmWithChain } from "@src/modules/common";

const path = getFilePath(__filename);

export const getTokenBalances = async (walletAddress: string) => {
  try {
    const walletInfo = (await axios({
      url: `${process.env.COVALENT_V1_API_URL}/${process.env.ARBITRUM_MAINNET_CHAIN_ID}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`,
      method: "get",
    })) as any;
    const existingTokens = walletInfo?.data?.data?.items;
    const response = [];
    if (existingTokens && Array.isArray(existingTokens)) {
      for (let i = 0; i < existingTokens.length; i++) {
        const contractAddress = existingTokens[i].contract_address.toLowerCase();
        const chainId = EvmWithChain[Platform.ARBITRUM].chainId;
        const isScam = await isScamToken(contractAddress, chainId);

        if (existingTokens[i].balance > 0) {
          const balance = Number(
            parseFloat(
              formatBalance(existingTokens[i].balance, parseInt(existingTokens[i].contract_decimals) as any),
            )?.toFixed(2),
          );

          const price = existingTokens[i]?.quote_rate;
          const value = balance * existingTokens[i]?.quote_rate;
          const symbol = existingTokens[i].contract_ticker_symbol?.toLowerCase();
          const logo = await getCurrencyLogo(symbol);

          if (price && symbol && !isScam) {
            response.push({
              name: existingTokens[i].contract_name,
              symbol,
              contractAddress: existingTokens[i].contract_address,
              type: existingTokens[i].type,
              logo,
              balance,
              price,
              value,
              platform: Platform.ARBITRUM,
              scan: `https://arbiscan.io/tokenholdings?a=${walletAddress}`,
            });
          }
        }
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
