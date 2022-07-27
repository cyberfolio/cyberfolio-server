import { CexName } from '@config/types';
import { getFilePath, logError, removeMongoFields } from '@src/utils';
import { cexInfoModel, cexAssetModel } from './models';

const path = getFilePath(__filename);

const addCexByKeyIdentifier = async ({
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

const getCexInfosByKey = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  let cexes = await cexInfoModel
    .find({
      keyIdentifier,
    })
    .lean();
  cexes = cexes.map((cex) => removeMongoFields(cex));

  return cexes;
};

const getCexInfo = async ({ keyIdentifier, cexName }: { keyIdentifier: string; cexName: CexName }) => {
  const cex = await cexInfoModel
    .findOne({
      keyIdentifier,
      cexName,
    })
    .lean();
  return cex;
};

const fetchSpotAssets = async ({ keyIdentifier, cexName }: { keyIdentifier: string; cexName: CexName }) => {
  let assets = await cexAssetModel
    .find({
      keyIdentifier,
      cexName,
    })
    .lean();
  assets = assets.map((asset) => removeMongoFields(asset));
  return assets;
};

const fetchAllSpotAssets = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  let assets = await cexAssetModel
    .find({
      keyIdentifier,
    })
    .lean();
  assets = assets.map((asset) => removeMongoFields(asset));
  return assets;
};

const addCexAsset = async ({
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
  try {
    await cexAssetModel.findOneAndUpdate(
      {
        keyIdentifier,
        cexName,
        name,
        symbol: symbol.toLowerCase(),
      },
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

const deleteCex = async ({ keyIdentifier, cexName }: { keyIdentifier: string; cexName: CexName }) => {
  try {
    await cexInfoModel.deleteOne({
      keyIdentifier,
      cexName,
    });
    await cexAssetModel.deleteMany({ keyIdentifier, cexName });
  } catch (e) {
    logError({
      e,
      func: deleteCex.name,
      path,
    });
    throw e;
  }
};

const CexRepository = {
  addCexByKeyIdentifier,
  getCexInfosByKey,
  getCexInfo,
  fetchSpotAssets,
  fetchAllSpotAssets,
  addCexAsset,
  deleteCex,
};

export default CexRepository;
