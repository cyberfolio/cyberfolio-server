import * as cexRepo from "../cex/services";
import * as dexRepo from "../dex/repository";

export const getNetWorth = async ({
  keyIdentifier,
}: {
  keyIdentifier: string;
}) => {
  try {
    const dexAssets = await dexRepo.getAssetsByKey({ keyIdentifier });
    const dexTotalValue = dexAssets.reduce(function (acc: any, obj: any) {
      return acc + obj.value;
    }, 0);

    const cexAssets = await cexRepo.getAllSpot({ keyIdentifier });
    const cexTotalValue = cexAssets.reduce(function (acc: any, obj: any) {
      return acc + obj.value;
    }, 0);

    return dexTotalValue + cexTotalValue;
  } catch (e) {
    throw new Error(e);
  }
};

export const getAvailableAccounts = async ({
  keyIdentifier,
}: {
  keyIdentifier: string;
}) => {
  try {
    const dexAssets = await dexRepo.getAssetsByKey({ keyIdentifier });
    const dexTotalValue = dexAssets.reduce(function (acc: any, obj: any) {
      return acc + obj.value;
    }, 0);

    const cexAssets = await cexRepo.getAllSpot({ keyIdentifier });
    const cexTotalValue = cexAssets.reduce(function (acc: any, obj: any) {
      return acc + obj.value;
    }, 0);

    return dexTotalValue + cexTotalValue;
  } catch (e) {
    throw new Error(e);
  }
};
