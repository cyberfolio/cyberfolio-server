import Web3 from "web3";
import axios from "axios";

import { getFilePath, logError } from "@src/utils";
import { Platform, ScanURL } from "@config/types";
import evmAssetsResponse from "@dex/common/evmAssetsResponse";

const web3 = new Web3(
  new Web3.providers.HttpProvider(`${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`),
);
const coingeckoERC20TokenListURL = process.env.COINGECKO_ERC20_TOKEN_LIST_URL;

export const isValidEthAddress = (address: string) => {
  return web3.utils.isAddress(address);
};

const path = getFilePath(__filename);

export const getEthBalance = async (walletAddress: string) => {
  try {
    const balance = await web3.eth.getBalance(walletAddress);
    return web3.utils.fromWei(balance, "ether");
  } catch (e) {
    logError({
      e,
      func: getEthBalance.name,
      path,
    });
    throw e;
  }
};

export const getERC20Tokens = async () => {
  try {
    const response = (await axios({
      url: coingeckoERC20TokenListURL,
      method: "get",
    })) as any;
    if (response?.data?.tokens) {
      const contracts = response.data.tokens.map((token: any) => {
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
    logError({
      e,
      func: getERC20Tokens.name,
      path,
    });
    throw e;
  }
};

export const getTokenBalances = async (walletAddress: string) => {
  try {
    const walletInfo = (await axios({
      url: `${process.env.COVALENT_V1_API_URL}/${process.env.ETHEREUM_MAINNET_CHAIN_ID}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`,
      method: "get",
    })) as any;
    const assets = walletInfo?.data?.data?.items;
    const response = evmAssetsResponse(walletAddress, ScanURL.ETHEREUM, assets, Platform.ETHEREUM);

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
