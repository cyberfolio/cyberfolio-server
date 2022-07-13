import { CexName } from "@config/types";
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
  cexName: CexName;
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

export const getCexInfo = async ({ keyIdentifier, cexName }: { keyIdentifier: string; cexName: CexName }) => {
  const cex = await cexInfoModel
    .findOne({
      keyIdentifier,
      cexName,
    })
    .lean();
  return cex;
};

export const fetchSpotAssets = async ({ keyIdentifier, cexName }: { keyIdentifier: string; cexName: CexName }) => {
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
  accountName,
}: {
  keyIdentifier: string;
  cexName: CexName;
  name: string;
  symbol: string;
  balance: number;
  price: number;
  value: number;
  logo: string | undefined;
  accountName: string;
}) => {
  symbol = symbol.toLowerCase();
  try {
    await cexAssetModel.findOneAndUpdate(
      { keyIdentifier, cexName, name, symbol },
      {
        balance,
        price,
        value,
        logo,
        accountName,
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
