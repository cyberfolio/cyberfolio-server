const cexRepo = require("../cex/services");
const dexRepo = require("../dex/repository");

const getNetWorth = async ({ keyIdentifier }) => {
  try {
    const dexAssets = await dexRepo.getAssetsByKey({ keyIdentifier });
    const dexTotalValue = dexAssets.reduce(function (acc, obj) {
      return acc + obj.value;
    }, 0);

    const cexAssets = await cexRepo.getSpotAssets({ keyIdentifier });
    const cexTotalValue = cexAssets.reduce(function (acc, obj) {
      return acc + obj.value;
    }, 0);

    return dexTotalValue + cexTotalValue;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getNetWorth,
};
