const {
  getCurrenyInfo,
} = require("../../../modules/providers/coingecko/repository");
const { deleteMongoVersionAndId } = require("../../../utils");
const { walletsModel, dexAssetModel } = require("./models");

const addWalletByKeyIdentifier = async ({
  keyIdentifier,
  walletAddress,
  walletName,
  chain,
}) => {
  const wallet = await walletsModel.findOne({
    keyIdentifier,
    walletAddress,
  });
  if (wallet) {
    return;
  }
  await walletsModel.create({
    keyIdentifier,
    walletAddress,
    walletName,
    chain,
  });
};

const getWallet = async ({ keyIdentifier, chain }) => {
  const wallet = await walletsModel.findOne({ keyIdentifier, chain });
  return deleteMongoVersionAndId(wallet);
};

const getWalletByName = async ({ keyIdentifier, walletName }) => {
  const wallet = await walletsModel.findOne({ keyIdentifier, walletName });
  return deleteMongoVersionAndId(wallet);
};

const addAssets = async ({
  keyIdentifier,
  walletName,
  name,
  symbol,
  balance,
  price,
  value,
  chain,
  contractAddress,
}) => {
  try {
    symbol = symbol.toLowerCase();
    const currenyInfo = await getCurrenyInfo(symbol);
    const logo = currenyInfo?.logo ? currenyInfo?.logo : undefined;
    await dexAssetModel.findOneAndUpdate(
      { keyIdentifier, name, symbol, walletName, chain },
      {
        keyIdentifier,
        walletName,
        name,
        symbol,
        balance,
        price,
        value,
        logo,
        chain,
        contractAddress,
      },
      { upsert: true, new: true }
    );
  } catch (e) {
    throw new Error(e);
  }
};

const getAssets = async ({ keyIdentifier, chain }) => {
  try {
    const assets = await dexAssetModel.find({ keyIdentifier, chain });
    const filtered = assets.map((asset) => deleteMongoVersionAndId(asset));
    return filtered;
  } catch (e) {
    throw new Error(e);
  }
};

const getAssetsByKey = async ({ keyIdentifier }) => {
  try {
    const assets = await dexAssetModel.find({ keyIdentifier });
    const filtered = assets.map((asset) => deleteMongoVersionAndId(asset));
    return filtered;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  addWalletByKeyIdentifier,
  getWallet,
  addAssets,
  getAssets,
  getAssetsByKey,
  getWalletByName,
};
