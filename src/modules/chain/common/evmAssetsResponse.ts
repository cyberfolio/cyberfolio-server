import AppStructures from '@structures/index';

import AppProviders from '@providers/index';
import AppUtils from '@utils/index';
import AppConstants from '@constants/index';

import { CovalentTokenBalanceItems, DexAssetAPIResponse } from './types';

const path = AppUtils.getFilePath(__filename);

const evmAssetsResponse = async (
  walletAddress: string,
  scanURL: AppStructures.ScanURL,
  assets: CovalentTokenBalanceItems[],
  chain: AppStructures.Chain,
) => {
  const response: DexAssetAPIResponse[] = [];
  if (!assets || !Array.isArray(assets)) return response;

  for (const asset of assets) {
    try {
      const contractAddress = asset.contract_address?.toLowerCase();
      const platform = AppConstants.PlatformNames[chain];
      const isScam = platform.evmChainId
        ? false
        : await AppUtils.isScamToken(contractAddress, platform.evmChainId as string);

      if (Number(asset.balance) > 0) {
        let balance = Number(AppUtils.formatBalance(asset.balance, asset.contract_decimals));
        if (contractAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
          balance = parseFloat(balance.toFixed(5));
        } else {
          balance = parseFloat(balance.toFixed(3));
        }

        const name = asset.contract_name;
        const price = asset.quote_rate;
        if (price === null) {
          continue;
        }
        const value = balance * price;
        const symbol = asset.contract_ticker_symbol?.toLowerCase();
        const logo = symbol ? await AppProviders.Coingecko.getCurrencyLogo(symbol) : '';
        let scan = '';
        if (scanURL === AppStructures.ScanURL.SOLANA && contractAddress !== '11111111111111111111111111111111') {
          scan = `${scanURL}/address/${walletAddress}/tokens`;
        } else if (scanURL === AppStructures.ScanURL.SOLANA && contractAddress === '11111111111111111111111111111111') {
          scan = `${scanURL}/address/${walletAddress}`;
        } else if (contractAddress && contractAddress !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
          scan = `${scanURL}/token/${contractAddress}?a=${walletAddress}`;
        } else {
          scan = `${scanURL}/address/${walletAddress}`;
        }
        if (symbol?.toLowerCase() === 'uni-v2' || price > 200000 || balance === 0) {
          continue;
        }

        if (price && symbol && !isScam) {
          response.push({
            name,
            symbol,
            contractAddress,
            logo,
            balance,
            price,
            value,
            chain,
            scan,
          });
        }
      }
    } catch (e) {
      AppUtils.logError({
        e,
        func: evmAssetsResponse.name,
        path,
      });
      throw e;
    }
  }
  return response;
};

export default evmAssetsResponse;
