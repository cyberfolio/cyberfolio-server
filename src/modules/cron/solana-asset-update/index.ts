import { userModel } from "@api/auth/repository/models";
import { dexAssetModel } from "@api/dex/repository/models";
import { Chain } from "@config/types";

import arbitrum from "@dex/arbitrum";
import avalanche from "@dex/avalanche";
import ethereum from "@dex/ethereum";
import optimism from "@dex/optimism";
import polygon from "@dex/polygon";
import smartchain from "@dex/smartchain";

import { logError, getFilePath, sleep } from "@src/utils";

const path = getFilePath(__filename);

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
  return array1.filter((object1) => {
    return !array2.some((object2) => {
      return object1.symbol === object2.symbol && object1.chain === object2.chain;
    });
  });
}

const updateEvmAssets = async () => {
  try {
    const users = await userModel.find({}).lean();
    for (const user of users) {
      const walletAddress = user.keyIdentifier;
      const assets = await dexAssetModel
        .find({
          keyIdentifier: walletAddress,
          chain: Chain.SOLANA,
        })
        .lean();

      // stop 2 seconds for api rate limit
      await sleep(2000);

      for (const asset of assetsThatAreNotOwnedAnymore) {
        await dexAssetModel.deleteOne({ keyIdentifier: walletAddress, symbol: asset.symbol, chain: asset.chain });
      }

      // Update assets that is owned at this time
      for (const evmAsset of evmAssets) {
        await dexAssetModel.findOneAndUpdate(
          { keyIdentifier: walletAddress, symbol: evmAsset.symbol, chain: evmAsset.chain, chain: Chain.SOLANA },
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
