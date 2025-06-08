import AppUtils from '@utils/index';
import AppStructures from '@structures/index';
import AppConstants from '@constants/index';
import Moralis from 'moralis';

const path = AppUtils.getFilePath(__filename);

const getTokenBalances = async (walletAddress: string) => {
  try {
    const tokenBalancesResponse = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      chain: AppUtils.toHexChainId(AppConstants.ChainIDs.POLYGON),
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
        chain: AppStructures.Chain.POLYGON,
        scan: AppStructures.ScanURL.POLYGON,
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

const polygon = {
  getTokenBalances,
};

export default polygon;
