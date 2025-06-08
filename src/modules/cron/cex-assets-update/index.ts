import { userModel } from '@api/auth/repository/models';
import { cexAssetModel, cexInfoModel } from '@api/cex/repository/models';
import AppModules from '@src/modules';
import AppStructures from '@structures/index';

import AppUilts from '@src/utils';

const path = AppUilts.getFilePath(__filename);

function getDifference(
  array1: {
    symbol: string;
    cexName: AppStructures.CexName;
  }[],
  array2: {
    symbol: string;
    cexName: AppStructures.CexName;
  }[],
) {
  return array1.filter(
    (object1) => !array2.some((object2) => object1.symbol === object2.symbol && object1.cexName === object2.cexName),
  );
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

      const currentAssets: AppStructures.CexAssetResponse[] = [];
      const availableCexes = await cexInfoModel.find({ keyIdentifier: walletAddress }).lean();
      for (const availableCex of availableCexes) {
        if (availableCex.cexName === AppStructures.CexName.BINANCE) {
          const assets = await AppModules.Binance.getAssets({
            apiKey: availableCex.apiKey,
            apiSecret: availableCex.apiSecret,
          });
          currentAssets.push(...assets);
        }
        if (availableCex.cexName === AppStructures.CexName.KUCOIN) {
          const assets = await AppModules.Kucoin.getAssets({
            apiKey: availableCex.apiKey,
            apiSecret: availableCex.apiSecret,
            type: 'main',
            passphrase: availableCex.passphrase,
          });
          currentAssets.push(...assets);
        }
        if (availableCex.cexName === AppStructures.CexName.GATEIO) {
          const assets = await AppModules.Gateio.getAssets({
            apiKey: availableCex.apiKey,
            apiSecret: availableCex.apiSecret,
          });
          currentAssets.push(...assets);
        }
        if (availableCex.cexName === AppStructures.CexName.BINANCETR) {
          const assets = await AppModules.BinanceTR.getAssets({
            apiKey: availableCex.apiKey,
            apiSecret: availableCex.apiSecret,
          });
          currentAssets.push(...assets);
        }
        AppUilts.sleep(2000);
      }
      const existingAssets = currentAssets.map((cexAsset) => ({
        symbol: cexAsset.symbol,
        cexName: cexAsset.cexName,
      }));

      const assetsThatAreNotOwnedAnymore = [
        ...getDifference(oldAssets, existingAssets),
        ...getDifference(existingAssets, oldAssets),
      ];

      for (const asset of assetsThatAreNotOwnedAnymore) {
        await cexAssetModel.deleteOne({ keyIdentifier: walletAddress, symbol: asset.symbol, cexName: asset.cexName });
      }

      // Update assets that is owned at this time
      for (const currentAsset of currentAssets) {
        await cexAssetModel.findOneAndUpdate(
          { keyIdentifier: walletAddress, symbol: currentAsset.symbol, cexName: currentAsset.cexName },
          {
            balance: currentAsset.balance,
            price: currentAsset.price,
            value: currentAsset.value,
            contractAddress: currentAsset.contractAddress,
          },
        );
      }

      // update last asset update date
      await userModel.findOneAndUpdate({ keyIdentifier: walletAddress }, { lastAssetUpdate: new Date() });
    }
  } catch (e) {
    AppUilts.logError({
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
