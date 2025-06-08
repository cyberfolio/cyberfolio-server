import AppUtils from '@utils/index';
import AppStructures from '@structures/index';
import AppConstants from '@constants/index';
import Moralis from 'moralis';

const path = AppUtils.getFilePath(__filename);

export const getTokenBalances = async (walletAddress: string) => {
  try {
    const tokenBalancesResponse = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      chain: AppUtils.toHexChainId(AppConstants.ChainIDs.AVALANCHE_CCHAIN),
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
        chain: AppStructures.Chain.AVALANCHE,
        scan: AppStructures.ScanURL.AVALANCHE,
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

const avalanche = {
  getTokenBalances,
};

export default avalanche;
