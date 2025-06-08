"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("@utils/index"));
const models_1 = require("./models");
const path = index_1.default.getFilePath(__filename);
const addCexByKeyIdentifier = async ({ keyIdentifier, apiKey, apiSecret, cexName, passphrase, }) => {
    try {
        await models_1.cexInfoModel.create({
            keyIdentifier,
            apiKey,
            apiSecret,
            cexName,
            passphrase,
        });
    }
    catch (e) {
        index_1.default.logError({
            e,
            func: addCexByKeyIdentifier.name,
            path,
        });
        throw e;
    }
};
const getCexInfos = async ({ keyIdentifier }) => {
    let cexes = await models_1.cexInfoModel
        .find({
        keyIdentifier,
    })
        .lean();
    cexes = cexes.map((cex) => index_1.default.removeMongoFields(cex));
    return cexes;
};
const getCexInfo = async ({ keyIdentifier, cexName }) => {
    const cex = await models_1.cexInfoModel
        .findOne({
        keyIdentifier,
        cexName,
    })
        .lean();
    return cex;
};
const fetchSpotAssets = async ({ keyIdentifier, cexName }) => {
    let assets = await models_1.cexAssetModel
        .find({
        keyIdentifier,
        cexName,
    })
        .lean();
    assets = assets.map((asset) => index_1.default.removeMongoFields(asset));
    return assets;
};
const fetchAllSpotAssets = async ({ keyIdentifier }) => {
    let assets = await models_1.cexAssetModel
        .find({
        keyIdentifier,
    })
        .lean();
    assets = assets.map((asset) => index_1.default.removeMongoFields(asset));
    return assets;
};
const addCexAsset = async ({ keyIdentifier, cexName, name, symbol, balance, price, value, logo, accountName, }) => {
    try {
        await models_1.cexAssetModel.findOneAndUpdate({
            keyIdentifier,
            cexName,
            name,
            symbol: symbol.toLowerCase(),
        }, {
            balance,
            price,
            value,
            logo,
            accountName,
        }, { upsert: true, new: true });
    }
    catch (e) {
        index_1.default.logError({
            e,
            func: addCexAsset.name,
            path,
        });
        throw e;
    }
};
const deleteCex = async ({ keyIdentifier, cexName }) => {
    try {
        await models_1.cexInfoModel.deleteOne({
            keyIdentifier,
            cexName,
        });
        await models_1.cexAssetModel.deleteMany({ keyIdentifier, cexName });
    }
    catch (e) {
        index_1.default.logError({
            e,
            func: deleteCex.name,
            path,
        });
        throw e;
    }
};
const savePaymentHistory = async ({ keyIdentifier, cexPaymentHistory, }) => {
    try {
        await models_1.cexPaymentHistoryModel.create({
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
    }
    catch (e) {
        index_1.default.logError({
            e,
            func: savePaymentHistory.name,
            path,
        });
        throw e;
    }
};
const getPaymentHistory = async ({ keyIdentifier }) => {
    try {
        const history = await models_1.cexPaymentHistoryModel
            .find({
            keyIdentifier,
        })
            .lean();
        return history;
    }
    catch (e) {
        index_1.default.logError({
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
exports.default = CexRepository;
