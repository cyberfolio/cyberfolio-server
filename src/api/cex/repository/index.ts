import { Platform } from "@config/types";
import { getFilePath, logError, removeMongoFields } from "@src/utils";
import { cexInfoModel, cexAssetModel } from "./models";

const path = getFilePath(__filename);

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
  cexName: Platform;
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
    logError({
      e,
      func: addCexByKeyIdentifier.name,
      path,
    });
    throw e;
  }
};

export const getCexInfosByKey = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  let cexes = await cexInfoModel
    .find({
      keyIdentifier,
    })
    .lean();
  cexes = cexes.map((cex) => {
    return removeMongoFields(cex);
  });

  return cexes;
};

export const getCexInfo = async ({ keyIdentifier, cexName }: { keyIdentifier: string; cexName: Platform }) => {
  const cex = await cexInfoModel
    .findOne({
      keyIdentifier,
      cexName,
    })
    .lean();
  return removeMongoFields(cex);
};

export const fetchSpotAssets = async ({ keyIdentifier, cexName }: { keyIdentifier: string; cexName: Platform }) => {
  let assets = await cexAssetModel
    .find({
      keyIdentifier,
      cexName,
    })
    .lean();
  assets = assets.map((asset) => {
    return removeMongoFields(asset);
  });
  return assets;
};

export const fetchAllSpotAssets = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  let assets = await cexAssetModel
    .find({
      keyIdentifier,
    })
    .lean();
  assets = assets.map((asset) => {
    return removeMongoFields(asset);
  });
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
  logo,
}: {
  keyIdentifier: string;
  cexName: Platform;
  name: string;
  symbol: string;
  balance: number;
  price: number;
  value: number;
  logo: string | undefined;
}) => {
  symbol = symbol.toLowerCase();
  try {
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
        logo,
      },
      { upsert: true, new: true },
    );
  } catch (e) {
    logError({
      e,
      func: addCexAsset.name,
      path,
    });
    throw e;
  }
};
