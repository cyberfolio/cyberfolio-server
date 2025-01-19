import { Chain } from '@config/types';
import { getCurrenyInfo } from '@providers/coingecko/repository';
import AppUtils from '@utils/index';
import { walletsModel, dexAssetModel } from './models';

const path = AppUtils.getFilePath(__filename);

const addWalletByKeyIdentifier = async ({
  keyIdentifier,
  walletAddress,
  walletName,
  chain,
}: {
  keyIdentifier: string;
  walletAddress: string;
  walletName: string;
  chain: Chain;
}) => {
  const wallet = await walletsModel
    .findOne({
      keyIdentifier,
      walletAddress,
    })
    .lean();
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

const deleteWallet = async ({
  keyIdentifier,
  address,
  chain,
}: {
  keyIdentifier: string;
  address: string;
  chain: Chain;
}) => {
  await walletsModel.deleteOne({
    keyIdentifier,
    walletAddress: address,
    chain,
  });
};

const getWalletsByKey = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  let wallets = await walletsModel.find({ keyIdentifier }).lean().exec();
  wallets = wallets.map((wallet) => AppUtils.removeMongoFields(wallet));
  return wallets;
};

const getWallet = async ({ keyIdentifier, platform }: { keyIdentifier: string; platform: Chain }) => {
  const wallet = await walletsModel.findOne({ keyIdentifier, platform }).lean();
  return AppUtils.removeMongoFields(wallet);
};

const getWallets = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  const wallets = await walletsModel.find({ keyIdentifier }).lean();
  return wallets;
};

const getWalletByName = async ({ keyIdentifier, walletName }: { keyIdentifier: string; walletName: string }) => {
  const wallet = await walletsModel.findOne({ keyIdentifier, walletName }).lean();
  return AppUtils.removeMongoFields(wallet);
};

const addAsset = async ({
  keyIdentifier,
  walletName,
  name,
  symbol,
  balance,
  price,
  value,
  chain,
  contractAddress,
  walletAddress,
  scan,
}: {
  keyIdentifier: string;
  walletName: string;
  name: string;
  symbol: string;
  balance: number;
  price: number;
  value: number;
  chain: Chain;
  contractAddress: string;
  walletAddress: string;
  scan: string;
}) => {
  try {
    const formattedSymbol = symbol.toLowerCase();
    const currenyInfo = await getCurrenyInfo(formattedSymbol);
    const logo = currenyInfo?.logo ? currenyInfo?.logo : undefined;
    await dexAssetModel.findOneAndUpdate(
      {
        walletAddress,
        keyIdentifier,
        name,
        symbol: formattedSymbol,
        chain,
      },
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
        walletAddress,
        scan,
      },
      { upsert: true, new: true },
    );
  } catch (e) {
    AppUtils.logError({
      e,
      func: addAsset.name,
      path,
    });
    throw e;
  }
};

const getAssetsByKeyAndChain = async ({ keyIdentifier, chain }: { keyIdentifier: string; chain: Chain }) => {
  try {
    let assets = await dexAssetModel.find({ keyIdentifier, chain }).lean();
    assets = assets.map((asset) => AppUtils.removeMongoFields(asset));
    return assets;
  } catch (e) {
    AppUtils.logError({
      e,
      func: getAssetsByKeyAndChain.name,
      path,
    });
    throw e;
  }
};

const getAssets = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  try {
    let assets = await dexAssetModel.find({ keyIdentifier }).lean();
    assets = assets.map((asset) => AppUtils.removeMongoFields(asset));
    return assets;
  } catch (e) {
    AppUtils.logError({
      e,
      func: getAssets.name,
      path,
    });
    throw e;
  }
};

const getAllAssets = async () => {
  try {
    let assets = await dexAssetModel.find({}).lean();
    assets = assets.map((asset) => AppUtils.removeMongoFields(asset));
    return assets;
  } catch (e) {
    AppUtils.logError({
      e,
      func: getAllAssets.name,
      path,
    });
    throw e;
  }
};

const dexRepository = {
  addWalletByKeyIdentifier,
  deleteWallet,
  getWalletsByKey,
  getWallet,
  getWallets,
  getWalletByName,
  addAsset,
  getAssetsByKeyAndChain,
  getAssets,
  getAllAssets,
};

export default dexRepository;
