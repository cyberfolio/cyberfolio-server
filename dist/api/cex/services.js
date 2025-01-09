"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const binance_1 = __importDefault(require("@cex/binance"));
const binancetr_1 = __importDefault(require("@cex/binancetr"));
const kucoin_1 = __importDefault(require("@cex/kucoin"));
const gateio_1 = __importDefault(require("@cex/gateio"));
const utils_1 = __importDefault(require("@src/utils"));
const types_1 = require("@config/types");
const repository_1 = __importDefault(require("./repository"));
const checkIfExists = async ({ keyIdentifier, cexName }) => {
    const cexInfo = await repository_1.default.getCexInfo({
        keyIdentifier,
        cexName,
    });
    if (cexInfo !== null) {
        throw new Error(`You have already added ${cexName}`);
    }
};
const getAvailableCexes = async ({ keyIdentifier }) => {
    const cexInfo = await repository_1.default.getCexInfos({
        keyIdentifier,
    });
    return cexInfo;
};
const saveSpotAssets = async ({ cexName, apiKey, apiSecret, passphrase, keyIdentifier, }) => {
    let spotAssets = [];
    try {
        if (cexName === types_1.CexName.BINANCE) {
            spotAssets = await binance_1.default.getAssets({ apiKey, apiSecret });
        }
        else if (cexName === types_1.CexName.BINANCETR) {
            spotAssets = await binancetr_1.default.getAssets({ apiKey, apiSecret });
        }
        else if (cexName === types_1.CexName.KUCOIN) {
            spotAssets = await kucoin_1.default.getAssets({
                type: 'main',
                apiKey,
                apiSecret,
                passphrase,
            });
        }
        else if (cexName === types_1.CexName.GATEIO) {
            spotAssets = await gateio_1.default.getAssets({
                apiKey,
                apiSecret,
            });
        }
        else {
            throw new Error(`We do not support ${cexName} currently.`);
        }
        if (Array.isArray(spotAssets) && spotAssets.length > 0) {
            try {
                for (const spotAsset of spotAssets) {
                    await repository_1.default.addCexAsset({
                        keyIdentifier,
                        name: spotAsset.name,
                        symbol: spotAsset.symbol?.toLowerCase(),
                        balance: spotAsset.balance,
                        price: spotAsset.price,
                        value: spotAsset.value,
                        cexName: spotAsset.cexName,
                        logo: spotAsset.logo,
                        accountName: spotAsset.accountName,
                    });
                }
            }
            catch (e) {
                const error = utils_1.default.onError(e);
                throw error;
            }
        }
        return spotAssets;
    }
    catch (e) {
        const error = utils_1.default.onError(e);
        throw error;
    }
};
const getSpotAssets = async ({ keyIdentifier, cexName }) => {
    try {
        const cexInfo = await repository_1.default.getCexInfo({
            keyIdentifier,
            cexName,
        });
        if (!cexInfo) {
            return [];
        }
        const assets = await repository_1.default.fetchSpotAssets({
            keyIdentifier,
            cexName,
        });
        return assets;
    }
    catch (e) {
        const error = utils_1.default.onError(e);
        throw error;
    }
};
const add = async ({ keyIdentifier, apiKey, apiSecret, cexName, passphrase, }) => {
    try {
        await checkIfExists({ keyIdentifier, cexName });
        await saveSpotAssets({
            cexName,
            apiKey,
            apiSecret,
            keyIdentifier,
            passphrase,
        });
        await savePaymentHistory({
            apiKey,
            apiSecret,
            keyIdentifier,
            cexName,
        });
        await repository_1.default.addCexByKeyIdentifier({
            keyIdentifier,
            apiKey,
            apiSecret,
            cexName,
            passphrase,
        });
    }
    catch (e) {
        const error = utils_1.default.onError(e);
        throw error;
    }
};
const deleteCex = async ({ keyIdentifier, cexName }) => {
    try {
        await repository_1.default.deleteCex({
            keyIdentifier,
            cexName,
        });
    }
    catch (e) {
        const error = utils_1.default.onError(e);
        throw error;
    }
};
const getAssets = async ({ keyIdentifier }) => {
    try {
        const assets = await repository_1.default.fetchAllSpotAssets({
            keyIdentifier,
        });
        return assets;
    }
    catch (e) {
        const error = utils_1.default.onError(e);
        throw error;
    }
};
const savePaymentHistory = async ({ keyIdentifier, cexName, apiKey, apiSecret, }) => {
    const response = [];
    if (cexName === types_1.CexName.BINANCE) {
        const binancePaymentHistory = await binance_1.default.getPaymentHistory({ apiKey, apiSecret });
        try {
            for (const item of binancePaymentHistory) {
                await repository_1.default.savePaymentHistory({
                    keyIdentifier,
                    cexPaymentHistory: item,
                });
            }
        }
        catch (e) {
            const error = utils_1.default.onError(e);
            throw error;
        }
        response.push(...binancePaymentHistory);
    }
    return response;
};
const getPaymentHistory = async ({ keyIdentifier }) => {
    const history = await repository_1.default.getPaymentHistory({
        keyIdentifier,
    });
    const leanhistory = history.map((item) => {
        const fee = Number(item.fee).toLocaleString('en-US', {
            style: 'currency',
            currency: item.fiatCurrency,
        });
        const amount = Number(item.amount).toLocaleString('en-US', {
            style: 'currency',
            currency: item.fiatCurrency,
        });
        return {
            cexName: types_1.CexName.BINANCE,
            orderNo: item.orderNo,
            type: item.type,
            fee,
            status: item.status,
            createTime: item.createTime,
            date: utils_1.default.timestampToReadableDate(item.createTime),
            fiatCurrency: item.fiatCurrency,
            amount,
        };
    });
    return leanhistory;
};
const CexService = {
    checkIfExists,
    getAvailableCexes,
    saveSpotAssets,
    getSpotAssets,
    getAssets,
    savePaymentHistory,
    getPaymentHistory,
    add,
    deleteCex,
};
exports.default = CexService;
