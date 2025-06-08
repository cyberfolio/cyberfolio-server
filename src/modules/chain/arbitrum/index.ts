// import axios from 'axios';
import AppUtils from '@utils/index';

// import evmAssetsResponse from '@modules/chain/common/evmAssetsResponse';
import AppStructures from '@structures/index';
// import { CovalentTokenBalanceResponse } from '@modules/chain/common/types';
import AppConstants from '@constants/index';
import Moralis from 'moralis';
import { DexAssetAPIResponse } from '@modules/chain/common/types';

const path = AppUtils.getFilePath(__filename);

const getTokenBalances = async (walletAddress: string) => {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

  try {
    // const walletInfo = await axios.get<CovalentTokenBalanceResponse>(
    //   `${process.env.COVALENT_V1_API_URL}/${AppConstants.ChainIDs.ARBITRUM}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`,
    // );
    // const assets = walletInfo.data.data.items;
    // const response = await evmAssetsResponse(walletAddress, ScanURL.ARBITRUM, assets, Chain.ARBITRUM);

    const tokenBalancesResponse = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      chain: AppUtils.toHexChainId(AppConstants.ChainIDs.ETHEREUM),
      address: walletAddress,
    });

    const response: DexAssetAPIResponse[] = tokenBalancesResponse.response.result.map((item) => {
      return {
        name: item.name,
        symbol: item.symbol,
        contractAddress: String(item.tokenAddress?.lowercase),
        logo: item.logo,
        balance: Number(item.balanceFormatted),
        price: Number(item.usdPrice),
        value: item.usdValue,
        chain: AppStructures.Chain.ARBITRUM,
        scan: AppStructures.ScanURL.ARBITRUM,
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

const Arbitrum = {
  getTokenBalances,
};

export default Arbitrum;
