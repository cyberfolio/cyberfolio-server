import { logError, getFilePath } from "@src/utils";
import { getAllAssets } from "@src/api/dex/repository";
import scamTokens from "@config/scamTokens";
import { dexAssetModel } from "@src/api/dex/repository/models";

const path = getFilePath(__filename);

export const removeScamTokens = async () => {
  try {
    const assets = await getAllAssets();
    for (const asset of assets) {
      const isScamToken = scamTokens.find(
        (scamToken) =>
          scamToken.contractAddress.toLowerCase() === asset.contractAddress.toLowerCase() &&
          scamToken.platform === asset.platform,
      );
      if (isScamToken) {
        try {
          await dexAssetModel.deleteMany({ contractAddress: asset.contractAddress });
        } catch (e) {
          logError({
            func: removeScamTokens.name,
            path,
            e,
          });
        }
      }
    }
  } catch (e) {
    logError({
      func: removeScamTokens.name,
      path,
      e,
    });
    throw e;
  }
};
