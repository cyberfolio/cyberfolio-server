import { userModel } from "@api/auth/repository/models";
import { cexAssetModel, cexInfoModel } from "@api/cex/repository/models";
import Binance from "@cex/binance";
import Gateio from "@cex/gateio";
import Kucoin from "@cex/kucoin";
import FTX from "@cex/ftx";
import { CexName, CexAssetResponse } from "@config/types";

import { logError, getFilePath, sleep } from "@src/utils";

const path = getFilePath(__filename);

function getDifference(
  array1: {
    symbol: string;
    cexName: CexName;
  }[],
  array2: {
    symbol: string;
    cexName: CexName;
  }[],
) {
  return array1.filter((object1) => {
    return !array2.some((object2) => {
      return object1.symbol === object2.symbol && object1.cexName === object2.cexName;
    });
  });
}

const updateCexAssets = async () => {
  try {
    const users = await userModel.find({}).lean();
    for (const user of users) {
      const walletAddress = user.keyIdentifier;
      const assets = await cexAssetModel.find({ keyIdentifier: walletAddress }).lean();
      const oldAssets = assets.map((cexAsset) => ({
        symbol: cexAsset.symbol,
        cexName: cexAsset.cexName,
      }));

      const newAssets: CexAssetResponse[] = [];
      const availableCexes = await cexInfoModel.find({ keyIdentifier: walletAddress }).lean();
      for (const availableCex of availableCexes) {
        if (availableCex.cexName === CexName.BINANCE) {
          const assets = await Binance.getAssets({
            apiKey: availableCex.apiKey,
            apiSecret: availableCex.apiSecret,
          });
          newAssets.concat(...assets);
        }
        if (availableCex.cexName === CexName.KUCOIN) {
          const assets = await Kucoin.getAssets({
            apiKey: availableCex.apiKey,
            apiSecret: availableCex.apiSecret,
            type: "main",
            passphrase: availableCex.passphrase,
          });
          newAssets.concat(...assets);
        }
        if (availableCex.cexName === CexName.GATEIO) {
          const assets = await Gateio.getAssets({
            apiKey: availableCex.apiKey,
            apiSecret: availableCex.apiSecret,
          });
          newAssets.concat(...assets);
        }
        if (availableCex.cexName === CexName.FTX) {
          const assets = await FTX.getAssets({
            apiKey: availableCex.apiKey,
            apiSecret: availableCex.apiSecret,
          });
          newAssets.concat(...assets);
        }
        sleep(2000);
      }
      const existingAssets = newAssets.map((cexAsset) => ({
        symbol: cexAsset.symbol,
        cexName: cexAsset.cexName,
      }));

      const assetsThatAreNotOwnedAnymore = [
        ...getDifference(oldAssets, existingAssets),
        ...getDifference(existingAssets, oldAssets),
      ];

      for (const asset of assetsThatAreNotOwnedAnymore) {
        console.log(asset);
        // await cexAssetModel.deleteOne({ keyIdentifier: walletAddress, symbol: asset.symbol, cexName: asset.cexName });
      }

      // Update assets that is owned at this time
      for (const newAsset of newAssets) {
        await cexAssetModel.findOneAndUpdate(
          { keyIdentifier: walletAddress, symbol: newAsset.symbol, cexName: newAsset.cexName },
          {
            balance: newAsset.balance,
            price: newAsset.price,
            value: newAsset.value,
            contractAddress: newAsset.contractAddress,
          },
        );
      }

      // update last asset update date
      await userModel.findOneAndUpdate({ keyIdentifier: walletAddress }, { lastAssetUpdate: new Date() });
    }
  } catch (e) {
    logError({
      func: updateCexAssets.name,
      path,
      e,
    });
    throw e;
  }
};

export default {
  updateCexAssets,
};
