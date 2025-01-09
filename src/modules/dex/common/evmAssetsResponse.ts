import AppUtils from '@src/utils';
import { getCurrencyLogo } from '@providers/coingecko/repository';
import { Chain, ScanURL } from '@config/types';
import constants from '@constants/index';
import { CovalentTokenBalanceItems, DexAssetAPIResponse } from './types';

const path = AppUtils.getFilePath(__filename);

const evmAssetsResponse = async (
  walletAddress: string,
  scanURL: ScanURL,
  assets: CovalentTokenBalanceItems[],
  chain: Chain,
) => {
  const response: DexAssetAPIResponse[] = [];
  if (assets && Array.isArray(assets)) {
    for (const asset of assets) {
      try {
        const contractAddress = asset.contract_address?.toLowerCase();
        const { chainId } = constants.EvmWithChain[chain];
        const isScam = await AppUtils.isScamToken(contractAddress, chainId);

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
          const logo = symbol ? await getCurrencyLogo(symbol) : '';
          let scan = '';
          if (scanURL === ScanURL.SOLANA && contractAddress !== '11111111111111111111111111111111') {
            scan = `${scanURL}/address/${walletAddress}/tokens`;
          } else if (scanURL === ScanURL.SOLANA && contractAddress === '11111111111111111111111111111111') {
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
  }
  return response;
};

export default evmAssetsResponse;
