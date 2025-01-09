"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("@providers/coingecko/repository");
const utils_1 = __importDefault(require("@src/utils"));
const models_1 = require("./models");
const path = utils_1.default.getFilePath(__filename);
const addWalletByKeyIdentifier = async ({ keyIdentifier, walletAddress, walletName, chain, }) => {
    const wallet = await models_1.walletsModel
        .findOne({
        keyIdentifier,
        walletAddress,
    })
        .lean();
    if (wallet) {
        return;
    }
    await models_1.walletsModel.create({
        keyIdentifier,
        walletAddress,
        walletName,
        chain,
    });
};
const deleteWallet = async ({ keyIdentifier, address, chain, }) => {
    await models_1.walletsModel.deleteOne({
        keyIdentifier,
        walletAddress: address,
        chain,
    });
};
const getWalletsByKey = async ({ keyIdentifier }) => {
    let wallets = await models_1.walletsModel.find({ keyIdentifier }).lean().exec();
    wallets = wallets.map((wallet) => utils_1.default.removeMongoFields(wallet));
    return wallets;
};
const getWallet = async ({ keyIdentifier, platform }) => {
    const wallet = await models_1.walletsModel.findOne({ keyIdentifier, platform }).lean();
    return utils_1.default.removeMongoFields(wallet);
};
const getWallets = async ({ keyIdentifier }) => {
    const wallets = await models_1.walletsModel.find({ keyIdentifier }).lean();
    return wallets;
};
const getWalletByName = async ({ keyIdentifier, walletName }) => {
    const wallet = await models_1.walletsModel.findOne({ keyIdentifier, walletName }).lean();
    return utils_1.default.removeMongoFields(wallet);
};
const addAsset = async ({ keyIdentifier, walletName, name, symbol, balance, price, value, chain, contractAddress, walletAddress, scan, }) => {
    try {
        const formattedSymbol = symbol.toLowerCase();
        const currenyInfo = await (0, repository_1.getCurrenyInfo)(formattedSymbol);
        const logo = currenyInfo?.logo ? currenyInfo?.logo : undefined;
        await models_1.dexAssetModel.findOneAndUpdate({
            walletAddress,
            keyIdentifier,
            name,
            symbol: formattedSymbol,
            chain,
        }, {
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
        }, { upsert: true, new: true });
    }
    catch (e) {
        utils_1.default.logError({
            e,
            func: addAsset.name,
            path,
        });
        throw e;
    }
};
const getAssetsByKeyAndChain = async ({ keyIdentifier, chain }) => {
    try {
        let assets = await models_1.dexAssetModel.find({ keyIdentifier, chain }).lean();
        assets = assets.map((asset) => utils_1.default.removeMongoFields(asset));
        return assets;
    }
    catch (e) {
        utils_1.default.logError({
            e,
            func: getAssetsByKeyAndChain.name,
            path,
        });
        throw e;
    }
};
const getAssets = async ({ keyIdentifier }) => {
    try {
        let assets = await models_1.dexAssetModel.find({ keyIdentifier }).lean();
        assets = assets.map((asset) => utils_1.default.removeMongoFields(asset));
        return assets;
    }
    catch (e) {
        utils_1.default.logError({
            e,
            func: getAssets.name,
            path,
        });
        throw e;
    }
};
const getAllAssets = async () => {
    try {
        let assets = await models_1.dexAssetModel.find({}).lean();
        assets = assets.map((asset) => utils_1.default.removeMongoFields(asset));
        return assets;
    }
    catch (e) {
        utils_1.default.logError({
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
exports.default = dexRepository;
