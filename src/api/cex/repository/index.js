const { deleteMongoVersionAndId } = require("../../../utils");
const { cexInfoModel, cexAssetModel } = require("./models");

const addCexByKeyIdentifier = async ({
  keyIdentifier,
  apiKey,
  apiSecret,
  cexName,
}) => {
  const cex = await cexInfoModel.findOne({
    keyIdentifier,
    cexName,
  });
  if (cex) {
    return;
  }

  try {
    await cexInfoModel.create({
      keyIdentifier,
      apiKey,
      apiSecret,
      cexName,
    });
  } catch (e) {
    throw new Error(e);
  }
};

const getCexInfoByKeyIdentifier = async ({ keyIdentifier, cexName }) => {
  const cex = await cexInfoModel.findOne({
    keyIdentifier,
    cexName,
  });
  return cex;
};

const fetchSpotAssets = async ({ keyIdentifier, cexName }) => {
  const assets = await cexAssetModel.find({
    keyIdentifier,
    cexName,
  });
  const filtered = assets.map((asset) => deleteMongoVersionAndId(asset));
  return filtered;
};

const addCexHoldingByKeyIdentifier = async ({
  keyIdentifier,
  cexName,
  name,
  symbol,
  balance,
  price,
  value,
}) => {
  const asset = await cexAssetModel.findOne({
    keyIdentifier,
    cexName,
    name,
  });
  if (asset) {
    try {
      await cexAssetModel.updateOne(
        { keyIdentifier, cexName, name, symbol },
        {
          balance,
          price,
          value,
        },
        { upsert: true }
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  try {
    await cexAssetModel.create({
      keyIdentifier,
      cexName,
      name,
      symbol,
      balance,
      price,
      value,
    });
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  addCexByKeyIdentifier,
  addCexHoldingByKeyIdentifier,
  getCexInfoByKeyIdentifier,
  fetchSpotAssets,
};
