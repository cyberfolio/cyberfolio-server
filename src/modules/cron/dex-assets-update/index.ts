import { userModel } from "@api/auth/repository/models";
import { dexAssetModel } from "@api/dex/repository/models";

import arbitrum from "@dex/arbitrum";
import avalanche from "@dex/avalanche";
import ethereum from "@dex/ethereum";
import optimism from "@dex/optimism";
import polygon from "@dex/polygon";
import smartchain from "@dex/smartchain";

import { logError, getFilePath, sleep } from "@src/utils";
import { platform } from "os";

const path = getFilePath(__filename);

const updateEvmAssets = async () => {
  try {
    const users = await userModel.find({}).lean();
    for (const user of users) {
      const walletAddress = user.keyIdentifier;
      const assets = await dexAssetModel.find({ keyIdentifier: walletAddress }).lean();

      const arbiAssets = await arbitrum.getTokenBalances(walletAddress);
      const avaAssets = await avalanche.getTokenBalances(walletAddress);
      const ethAssets = await ethereum.getTokenBalances(walletAddress);
      const optiAssets = await optimism.getTokenBalances(walletAddress);
      const polygonAssets = await polygon.getTokenBalances(walletAddress);
      const bscAssets = await smartchain.getTokenBalances(walletAddress);

      // stop 2 seconds for api rate limit
      await sleep(2000);

      const evmAssets = [...arbiAssets, ...avaAssets, ...ethAssets, ...optiAssets, ...polygonAssets, ...bscAssets];

      // Remove assets that are not owned anymore
      const existingAssetSymbols = evmAssets.map((evmAsset) => ({
        symbol: evmAsset.symbol,
        platform: evmAsset.platform,
      }));
      const oldSymbols = assets.map((evmAsset) => ({
        symbol: evmAsset.symbol,
        platform: evmAsset.platform,
      }));
      const assetsThatAreNotOwnedAnymore = oldSymbols.filter((x) => existingAssetSymbols.indexOf(x) === -1);
      for (const asset of assetsThatAreNotOwnedAnymore) {
        await dexAssetModel.deleteOne({ keyIdentifier: walletAddress, symbol: asset.symbol, platform: asset.platform });
      }

      // Update assets that is owned at this time
      for (const evmAsset of evmAssets) {
        await dexAssetModel.findOneAndUpdate(
          { keyIdentifier: walletAddress, symbol: evmAsset.symbol, platform: evmAsset.platform },
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
    logError({
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
