import { CexName } from '@config/types';
import AppUtils from '@utils/index';
import { CexPaymentHistory } from '@api/cex/types';
import { cexInfoModel, cexAssetModel, cexPaymentHistoryModel } from './models';

const path = AppUtils.getFilePath(__filename);

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
  try {
    await cexInfoModel.create({
      keyIdentifier,
      apiKey,
      apiSecret,
      cexName,
      passphrase,
    });
  } catch (e) {
    AppUtils.logError({
      e,
      func: addCexByKeyIdentifier.name,
      path,
    });
    throw e;
  }
};

const getCexInfos = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  let cexes = await cexInfoModel
    .find({
      keyIdentifier,
    })
    .lean();
  cexes = cexes.map((cex) => AppUtils.removeMongoFields(cex));

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
  assets = assets.map((asset) => AppUtils.removeMongoFields(asset));
  return assets;
};

const fetchAllSpotAssets = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  let assets = await cexAssetModel
    .find({
      keyIdentifier,
    })
    .lean();
  assets = assets.map((asset) => AppUtils.removeMongoFields(asset));
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
    AppUtils.logError({
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
    AppUtils.logError({
      e,
      func: deleteCex.name,
      path,
    });
    throw e;
  }
};

const savePaymentHistory = async ({
  keyIdentifier,
  cexPaymentHistory,
}: {
  keyIdentifier: string;
  cexPaymentHistory: CexPaymentHistory;
}) => {
  try {
    await cexPaymentHistoryModel.create({
      keyIdentifier,
      orderNo: cexPaymentHistory.orderNo,
      cexName: cexPaymentHistory.cexName,
      type: cexPaymentHistory.type,
      fee: cexPaymentHistory.fee,
      status: cexPaymentHistory.status,
      date: cexPaymentHistory.date,
      createTime: cexPaymentHistory.createTime,
      fiatCurrency: cexPaymentHistory.fiatCurrency,
      amount: Number(cexPaymentHistory.amount),
    });
  } catch (e) {
    AppUtils.logError({
      e,
      func: savePaymentHistory.name,
      path,
    });
    throw e;
  }
};

const getPaymentHistory = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  try {
    const history = await cexPaymentHistoryModel
      .find({
        keyIdentifier,
      })
      .lean();
    return history;
  } catch (e) {
    AppUtils.logError({
      e,
      func: getPaymentHistory.name,
      path,
    });
    throw e;
  }
};

const CexRepository = {
  addCexByKeyIdentifier,
  getCexInfos,
  getCexInfo,
  fetchSpotAssets,
  fetchAllSpotAssets,
  addCexAsset,
  deleteCex,
  savePaymentHistory,
  getPaymentHistory,
};

export default CexRepository;
