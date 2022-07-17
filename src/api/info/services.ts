import { onError } from '@src/utils';
import * as cexRepo from '@api/cex/services';
import dexRepo from '@api/dex/repository';
import { CexName } from '@config/types';
import { ConnectedAccountsResponse, ConnectedWallets } from './types';

export const getNetWorth = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  try {
    const dexAssets = await dexRepo.getAssetsByKey({ keyIdentifier });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dexTotalValue = dexAssets.reduce((acc: any, obj: any) => acc + obj.value, 0);

    const cexAssets = await cexRepo.getAllSpot({ keyIdentifier });
    let cexTotalValue = 0;
    if (cexAssets) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cexTotalValue = cexAssets.reduce((acc: any, obj: any) => acc + obj.value, 0);
    }
    return dexTotalValue + cexTotalValue;
  } catch (e) {
    onError(e);
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
    const connectedWallets: ConnectedWallets[] = wallets.map(({ chain, walletAddress, walletName }) => {
      return { chain, walletAddress, walletName };
    });

    const cexes = await cexRepo.getAvailableCexes({ keyIdentifier });
    const connectedCexes: CexName[] = cexes.map((cex) => {
      return cex.cexName;
    });

    const res: ConnectedAccountsResponse = {
      cexes: connectedCexes,
      wallets: connectedWallets,
    };

    return res;
  } catch (e) {
    onError(e);
  }
};
