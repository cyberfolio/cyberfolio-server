import { getCurrenyInfo } from "@providers/coingecko/repository";
import { deleteMongoVersionAndId } from "@src/utils";
import { walletsModel, dexAssetModel } from "./models";

export const addWalletByKeyIdentifier = async ({
  keyIdentifier,
  walletAddress,
  walletName,
  chain,
}: {
  keyIdentifier: string;
  walletAddress: string;
  walletName: string;
  chain: string;
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

export const getWallet = async ({
  keyIdentifier,
  chain,
}: {
  keyIdentifier: string;
  chain: string;
}) => {
  const wallet = await walletsModel.findOne({ keyIdentifier, chain });
  return deleteMongoVersionAndId(wallet);
};

export const getWalletByName = async ({
  keyIdentifier,
  walletName,
}: {
  keyIdentifier: string;
  walletName: string;
}) => {
  const wallet = await walletsModel.findOne({ keyIdentifier, walletName });
  return deleteMongoVersionAndId(wallet);
};

export const addAsset = async ({
  keyIdentifier,
  walletName,
  name,
  symbol,
  balance,
  price,
  value,
  chain,
  contractAddress,
}: {
  keyIdentifier: string;
  walletName: string;
  name: string;
  symbol: string;
  balance: number;
  price: number;
  value: number;
  chain: string;
  contractAddress: string;
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

export const getAssets = async ({
  keyIdentifier,
  chain,
}: {
  keyIdentifier: string;
  chain: string;
}) => {
  try {
    const assets = await dexAssetModel.find({ keyIdentifier, chain });
    const filtered = assets.map((asset) => deleteMongoVersionAndId(asset));
    return filtered;
  } catch (e) {
    throw new Error(e);
  }
};

export const getAssetsByKey = async ({
  keyIdentifier,
}: {
  keyIdentifier: string;
}) => {
  try {
    const assets = await dexAssetModel.find({ keyIdentifier });
    const filtered = assets.map((asset) => deleteMongoVersionAndId(asset));
    return filtered;
  } catch (e) {
    throw new Error(e);
  }
};
