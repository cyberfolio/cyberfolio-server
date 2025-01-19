import { userModel } from '@api/auth/repository/models';
import { dexAssetModel } from '@api/dex/repository/models';
import { Chain } from '@config/types';

import arbitrum from '@dex/arbitrum';
import avalanche from '@dex/avalanche';
import ethereum from '@dex/ethereum';
import optimism from '@dex/optimism';
import polygon from '@dex/polygon';
import smartchain from '@dex/smartchain';

import AppUtils from '@utils/index';

const path = AppUtils.getFilePath(__filename);

function getDifference(
  array1: {
    symbol: string;
    chain: Chain;
  }[],
  array2: {
    symbol: string;
    chain: Chain;
  }[],
) {
  return array1.filter(
    (object1) => !array2.some((object2) => object1.symbol === object2.symbol && object1.chain === object2.chain),
  );
}

const updateEvmAssets = async () => {
  try {
    const users = await userModel.find({}).lean();
    for (const user of users) {
      const walletAddress = user.keyIdentifier;
      const assets = await dexAssetModel
        .find({
          keyIdentifier: walletAddress,

          $and: [{ chain: { $ne: Chain.POLKADOT } }, { chain: { $ne: Chain.SOLANA } }],
        })
        .lean();

      const arbiAssets = await arbitrum.getTokenBalances(walletAddress);
      const avaAssets = await avalanche.getTokenBalances(walletAddress);
      const ethAssets = await ethereum.getTokenBalances(walletAddress);
      const optiAssets = await optimism.getTokenBalances(walletAddress);
      const polygonAssets = await polygon.getTokenBalances(walletAddress);
      const bscAssets = await smartchain.getTokenBalances(walletAddress);

      // stop 2 seconds for api rate limit
      await AppUtils.sleep(2000);

      const evmAssets = [...arbiAssets, ...avaAssets, ...ethAssets, ...optiAssets, ...polygonAssets, ...bscAssets];

      // Remove assets that are not owned anymore
      const existingAssets = evmAssets.map((evmAsset) => ({
        symbol: evmAsset.symbol,
        chain: evmAsset.chain,
      }));
      const oldAssets = assets.map((evmAsset) => ({
        symbol: evmAsset.symbol,
        chain: evmAsset.chain,
      }));

      const assetsThatAreNotOwnedAnymore = [
        ...getDifference(oldAssets, existingAssets),
        ...getDifference(existingAssets, oldAssets),
      ];

      for (const asset of assetsThatAreNotOwnedAnymore) {
        await dexAssetModel.deleteOne({ keyIdentifier: walletAddress, symbol: asset.symbol, chain: asset.chain });
      }

      // Update assets that is owned at this time
      for (const evmAsset of evmAssets) {
        await dexAssetModel.findOneAndUpdate(
          { keyIdentifier: walletAddress, symbol: evmAsset.symbol, chain: evmAsset.chain },
          {
            balance: evmAsset.balance,
            price: evmAsset.price,
            value: evmAsset.value,
            scan: evmAsset.scan,
            contractAddress: evmAsset.contractAddress,
          },
        );
      }

      // update last asset update date
      await userModel.findOneAndUpdate({ keyIdentifier: walletAddress }, { lastAssetUpdate: new Date() });
    }
  } catch (e) {
    AppUtils.logError({
      func: updateEvmAssets.name,
      path,
      e,
    });
    throw e;
  }
};

const functions = {
  updateEvmAssets,
};

export default functions;
