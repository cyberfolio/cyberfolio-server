import Web3 from 'web3';
import axios from 'axios';

import { getFilePath, logError } from '@src/utils';
import { Chain, ScanURL } from '@config/types';
import evmAssetsResponse from '@dex/common/evmAssetsResponse';
import { CovalentTokenBalanceResponse } from '@dex/common/types';
import Constants from '@config/constants';

const web3 = new Web3(
  new Web3.providers.HttpProvider(`${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`),
);

export const isValidEthAddress = (address: string) => web3.utils.isAddress(address);

const path = getFilePath(__filename);

export const getEthBalance = async (walletAddress: string) => {
  try {
    const balance = await web3.eth.getBalance(walletAddress);
    return web3.utils.fromWei(balance, 'ether');
  } catch (e) {
    logError({
      e,
      func: getEthBalance.name,
      path,
    });
    throw e;
  }
};

export const getTokenBalances = async (walletAddress: string) => {
  try {
    const walletInfo = await axios.get<CovalentTokenBalanceResponse>(
      `${process.env.COVALENT_V1_API_URL}/${Constants.ChainIDs.ETHEREUM}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`,
    );
    const assets = walletInfo.data.data.items;
    const response = await evmAssetsResponse(walletAddress, ScanURL.ETHEREUM, assets, Chain.ETHEREUM);
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

const ethereum = {
  getEthBalance,
  getTokenBalances,
};

export default ethereum;
