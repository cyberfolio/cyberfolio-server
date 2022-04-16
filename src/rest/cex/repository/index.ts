import { getCurrenyInfo } from "@providers/coingecko/repository";
import { deleteMongoVersionAndId } from "@src/utils";

import { cexInfoModel, cexAssetModel } from "./models";

export const addCexByKeyIdentifier = async ({
  keyIdentifier,
  apiKey,
  apiSecret,
  cexName,
  passphrase,
}: {
  keyIdentifier: string;
  apiKey: string;
  apiSecret: string;
  cexName: string;
  passphrase: string;
}) => {
  const cex = await cexInfoModel
    .findOne({
      keyIdentifier,
      cexName,
    })
    .lean();
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

export const getCexInfo = async ({
  keyIdentifier,
  cexName,
}: {
  keyIdentifier: string;
  cexName: string;
}) => {
  const cex = await cexInfoModel
    .findOne({
      keyIdentifier,
      cexName,
    })
    .lean();
  return cex;
};

export const fetchSpotAssets = async ({
  keyIdentifier,
  cexName,
}: {
  keyIdentifier: string;
  cexName: string;
}) => {
  const assets = await cexAssetModel
    .find({
      keyIdentifier,
      cexName: cexName?.toLowerCase(),
    })
    .lean();
  return assets;
};

export const fetchAllSpotAssets = async ({
  keyIdentifier,
}: {
  keyIdentifier: string;
}) => {
  const assets = await cexAssetModel
    .find({
      keyIdentifier,
    })
    .lean();
  return assets;
};

export const addCexAsset = async ({
  keyIdentifier,
  cexName,
  name,
  symbol,
  balance,
  price,
  value,
}: {
  keyIdentifier: string;
  cexName: string;
  name: string;
  symbol: string;
  balance: number;
  price: number;
  value: number;
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
