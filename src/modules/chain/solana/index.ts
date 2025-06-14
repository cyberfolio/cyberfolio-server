import axios from 'axios';
import AppUtils from '@utils/index';
import AppStructures from '@structures/index';
import evmAssetsResponse from '@modules/chain/common/evmAssetsResponse';
import { CovalentTokenBalanceResponse } from '@modules/chain/common/types';

const path = AppUtils.getFilePath(__filename);

const getTokenBalances = async (walletAddress: string) => {
  try {
    const walletInfo = await axios.get<CovalentTokenBalanceResponse>(
      `${process.env.COVALENT_V1_API_URL}/${process.env.SOLANA_MAINNET_CHAIN_ID}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`,
    );
    const assets = walletInfo.data.data.items;
    const response = await evmAssetsResponse(
      walletAddress,
      AppStructures.ScanURL.SOLANA,
      assets,
      AppStructures.Chain.SOLANA,
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

const solana = {
  getTokenBalances,
};

export default solana;
