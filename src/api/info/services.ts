import { getScanUrl, onError } from '@src/utils';
import cexRepo from '@api/cex/services';
import dexRepo from '@api/dex/repository';
import { Chain } from '@config/types';
import { ConnectedAccountsResponse, ConnectedCexes, ConnectedWallets } from './types';

export const getNetWorth = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  try {
    const dexAssets = await dexRepo.getAssetsByKey({ keyIdentifier });
    let dexTotalValue = 0;
    if (dexAssets) {
      dexTotalValue = dexAssets.reduce((acc, obj) => acc + obj.value, 0);
    }

    const cexAssets = await cexRepo.getAssetsByKey({ keyIdentifier });
    let cexTotalValue = 0;
    if (cexAssets) {
      cexTotalValue = cexAssets.reduce((acc, obj) => acc + obj.value, 0);
    }
    return dexTotalValue + cexTotalValue;
  } catch (e) {
    const error = onError(e);
    throw error;
  }
};

export const getConnectedAccounts = async ({
  keyIdentifier,
}: {
  keyIdentifier: string;
}): Promise<ConnectedAccountsResponse | undefined> => {
  try {
    const wallets = await dexRepo.getWalletsByKey({
      keyIdentifier,
    });
    const dexAssets = await dexRepo.getAssetsByKey({ keyIdentifier });
    const cexAssets = await cexRepo.getAssetsByKey({ keyIdentifier });

    const connectedWallets: ConnectedWallets[] = wallets.map(({ chain, walletAddress, walletName }) => {
      const netWorth = dexAssets.reduce((acc, dexAsset) => {
        if (
          dexAsset.chain === chain ||
          (chain === Chain.ETHEREUM &&
            (dexAsset.chain === Chain.ARBITRUM ||
              dexAsset.chain === Chain.AVALANCHE ||
              dexAsset.chain === Chain.BSC ||
              dexAsset.chain === Chain.OPTIMISM ||
              dexAsset.chain === Chain.POLYGON ||
              dexAsset.chain === Chain.ETHEREUM))
        ) {
          return acc + dexAsset.value;
        }
        return acc + 0;
      }, 0);
      const scan = getScanUrl(walletAddress, chain);
      return { chain, address: walletAddress, name: walletName, netWorth, scan };
    });

    const cexes = await cexRepo.getAvailableCexes({ keyIdentifier });
    const connectedCexes: ConnectedCexes[] = cexes.map((cex) => {
      const netWorth = cexAssets.reduce((acc, cexAsset) => {
        if (cexAsset.cexName === cex.cexName) {
          return acc + cexAsset.value;
        }
        return acc + 0;
      }, 0);
      return {
        name: cex.cexName,
        netWorth,
      };
    });

    const res: ConnectedAccountsResponse = {
      cexes: connectedCexes,
      wallets: connectedWallets,
    };

    return res;
  } catch (e) {
    const error = onError(e);
    throw error;
  }
};
