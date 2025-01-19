import axios from 'axios';
import AppUtils from '@utils/index';

import evmAssetsResponse from '@dex/common/evmAssetsResponse';
import { Chain, ScanURL } from '@config/types';
import { CovalentTokenBalanceResponse } from '@dex/common/types';
import Constants from '@config/constants';

const path = AppUtils.getFilePath(__filename);

const getTokenBalances = async (walletAddress: string) => {
  try {
    const walletInfo = await axios.get<CovalentTokenBalanceResponse>(
      `${process.env.COVALENT_V1_API_URL}/${Constants.ChainIDs.ARBITRUM}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`,
    );
    const assets = walletInfo.data.data.items;
    const response = await evmAssetsResponse(walletAddress, ScanURL.ARBITRUM, assets, Chain.ARBITRUM);
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

const arbitrum = {
  getTokenBalances,
};

export default arbitrum;
