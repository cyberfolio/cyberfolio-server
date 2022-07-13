import { CexName, Chain } from "@config/types";
import { onError } from "@src/utils";
import * as cexRepo from "../cex/services";
import dexRepo from "../dex/repository";

export const getNetWorth = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  try {
    const dexAssets = await dexRepo.getAssetsByKey({ keyIdentifier });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dexTotalValue = dexAssets.reduce(function (acc: any, obj: any) {
      return acc + obj.value;
    }, 0);

    const cexAssets = await cexRepo.getAllSpot({ keyIdentifier });
    let cexTotalValue = 0;
    if (cexAssets) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cexTotalValue = cexAssets.reduce(function (acc: any, obj: any) {
        return acc + obj.value;
      }, 0);
    }
    return dexTotalValue + cexTotalValue;
  } catch (e) {
    onError(e);
  }
};

export const getAvailableAccounts = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  try {
    const dexAssets = await dexRepo.getWalletsByKey({
      keyIdentifier,
    });
    const availableChains: Chain[] = [];
    dexAssets.map((dexAsset) => {
      availableChains.push(dexAsset.chain);
    });

    const cexAssets = await cexRepo.getAvailableCexes({ keyIdentifier });
    const availableCexes: CexName[] = [];
    cexAssets.map((dexAsset) => {
      availableCexes.push(dexAsset.cexName);
    });

    return {
      availableCexes,
      availableChains,
    };
  } catch (e) {
    onError(e);
  }
};
