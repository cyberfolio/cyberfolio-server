import Web3 from 'web3';
import web3Validator from 'web3-validator';

import AppUtils from '@utils/index';
import AppStructures from '@structures/index';
import AppConstants from '@constants/index';

import Moralis from 'moralis';

const web3 = new Web3(
  new Web3.providers.HttpProvider(`${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`),
);
export const isValidEthAddress = (address: string) => web3Validator.isAddress(address);

const path = AppUtils.getFilePath(__filename);

export const getEthBalance = async (walletAddress: string) => {
  try {
    const balance = await web3.eth.getBalance(walletAddress);
    return web3.utils.fromWei(balance, 'ether');
  } catch (e) {
    AppUtils.logError({
      e,
      func: getEthBalance.name,
      path,
    });
    throw e;
  }
};

export const getTokenBalances = async (walletAddress: string) => {
  try {
    const tokenBalancesResponse = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      chain: AppUtils.toHexChainId(AppConstants.ChainIDs.ETHEREUM),
      address: walletAddress,
    });

    const response: AppStructures.DexAssetAPIResponse[] = tokenBalancesResponse.response.result.map((item) => {
      return {
        name: item.name,
        symbol: item.symbol,
        contractAddress: String(item.tokenAddress?.lowercase),
        logo: item.logo,
        balance: Number(item.balanceFormatted),
        price: Number(item.usdPrice),
        value: item.usdValue,
        chain: AppStructures.Chain.ETHEREUM,
        scan: AppStructures.ScanURL.ETHEREUM,
      };
    });

    return response;
  } catch (e) {
    AppUtils.logError({
      e,
      func: getTokenBalances.name,
      path,
    });
    throw e;
  }
};

const ethereum = {
  getEthBalance,
  getTokenBalances,
};

export default ethereum;
