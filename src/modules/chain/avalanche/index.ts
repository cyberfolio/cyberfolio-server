import axios from 'axios';
import AppUtils from '@utils/index';
import evmAssetsResponse from '@modules/chain/common/evmAssetsResponse';
import AppStructures from '@structures/index';
import { CovalentTokenBalanceResponse } from '@modules/chain/common/types';
import AppConstants from '@constants/index';

const path = AppUtils.getFilePath(__filename);

export const getTokenBalances = async (walletAddress: string) => {
  try {
    const walletInfo = await axios.get<CovalentTokenBalanceResponse>(
      `${process.env.COVALENT_V1_API_URL}/${AppConstants.ChainIDs.AVALANCHE_CCHAIN}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`,
    );
    const assets = walletInfo.data.data.items;
    const response = await evmAssetsResponse(
      walletAddress,
      AppStructures.ScanURL.AVALANCHE,
      assets,
      AppStructures.Chain.AVALANCHE,
    );
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

const avalanche = {
  getTokenBalances,
};

export default avalanche;
