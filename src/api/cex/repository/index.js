const {
  getCurrenyInfo,
} = require("../../../modules/providers/coingecko/repository");
const { deleteMongoVersionAndId } = require("../../../utils");
const { cexInfoModel, cexAssetModel } = require("./models");

const addCexByKeyIdentifier = async ({
  keyIdentifier,
  apiKey,
  apiSecret,
  cexName,
  passphrase,
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
      passphrase,
    });
  } catch (e) {
    throw new Error(e);
  }
};

const getCexInfo = async ({ keyIdentifier, cexName }) => {
  const cex = await cexInfoModel.findOne({
    keyIdentifier,
    cexName,
  });
  return cex;
};

const fetchSpotAssets = async ({ keyIdentifier, cexName }) => {
  const assets = await cexAssetModel.find({
    keyIdentifier,
    cexName: cexName?.toLowerCase(),
  });
  const filtered = assets.map((asset) => deleteMongoVersionAndId(asset));
  return filtered;
};

const addCexAsset = async ({
  keyIdentifier,
  cexName,
  name,
  symbol,
  balance,
  price,
  value,
}) => {
  symbol = symbol.toLowerCase();
  try {
    const currenyInfo = await getCurrenyInfo(symbol);
    await cexAssetModel.findOneAndUpdate(
      { keyIdentifier, cexName, name, symbol },
      {
        keyIdentifier,
        cexName,
        name,
        symbol,
        balance,
        price,
        value,
        logo: currenyInfo.logo,
      },
      { upsert: true, new: true }
    );
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  addCexByKeyIdentifier,
  addCexAsset,
  getCexInfo,
  fetchSpotAssets,
};
