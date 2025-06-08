"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastCurrencyUpdateDate = exports.setLastCurrencyUpdateDate = exports.getContractAddressOfTheCurrencyBySymbol = exports.getFullNameOfTheCurrencyBySymbol = exports.getCurrenyInfo = exports.getCurrencyLogo = exports.getCryptoPriceBySymbol = exports.addOrUpdateCryptoCurrency = void 0;
const index_1 = __importDefault(require("@utils/index"));
const models_1 = require("./models");
const path = index_1.default.getFilePath(__filename);
const addOrUpdateCryptoCurrency = async ({ name, symbol, price, image, }) => {
    if (name && symbol && price) {
        try {
            await models_1.currencyModel.findOneAndUpdate({ name }, {
                name,
                symbol,
                price,
                logo: image || '',
            }, {
                upsert: true,
                timestamps: true,
            });
        }
        catch (e) {
            index_1.default.logError({
                e,
                func: exports.addOrUpdateCryptoCurrency.name,
                path,
            });
            throw e;
        }
    }
};
exports.addOrUpdateCryptoCurrency = addOrUpdateCryptoCurrency;
const getCryptoPriceBySymbol = async (symbol) => {
    try {
        const currency = await models_1.currencyModel.findOne({ symbol }).lean();
        return currency?.price ? parseFloat(currency.price.toFixed(2)) : null;
    }
    catch (e) {
        index_1.default.logError({
            e,
            func: exports.getCryptoPriceBySymbol.name,
            path,
        });
        throw e;
    }
};
exports.getCryptoPriceBySymbol = getCryptoPriceBySymbol;
const getCurrencyLogo = async (symbol) => {
    try {
        const currency = await models_1.currencyModel.findOne({ symbol }).lean();
        return currency?.logo;
    }
    catch (e) {
        index_1.default.logError({
            e,
            func: exports.getCurrencyLogo.name,
            path,
        });
        throw e;
    }
};
exports.getCurrencyLogo = getCurrencyLogo;
const getCurrenyInfo = async (symbol) => {
    try {
        const currency = await models_1.currencyModel.findOne({ symbol }).lean();
        return currency;
    }
    catch (e) {
        index_1.default.logError({
            e,
            func: exports.getCurrenyInfo.name,
            path,
        });
        throw e;
    }
};
exports.getCurrenyInfo = getCurrenyInfo;
const getFullNameOfTheCurrencyBySymbol = async (symbol) => {
    try {
        const currency = await models_1.currencyModel.findOne({ symbol }).lean();
        return currency?.name ? currency.name : '';
    }
    catch (e) {
        index_1.default.logError({
            e,
            func: exports.getFullNameOfTheCurrencyBySymbol.name,
            path,
        });
        throw e;
    }
};
exports.getFullNameOfTheCurrencyBySymbol = getFullNameOfTheCurrencyBySymbol;
const getContractAddressOfTheCurrencyBySymbol = async (symbol) => {
    try {
        const currency = await models_1.currencyModel.findOne({ symbol }).lean();
        return currency?.contractAddress ? currency.contractAddress : '';
    }
    catch (e) {
        index_1.default.logError({
            e,
            func: exports.getContractAddressOfTheCurrencyBySymbol.name,
            path,
        });
        throw e;
    }
};
exports.getContractAddressOfTheCurrencyBySymbol = getContractAddressOfTheCurrencyBySymbol;
const setLastCurrencyUpdateDate = async (lastUpdateDate) => {
    try {
        await models_1.lastCurrencyUpdateModel.findOneAndUpdate({ id: 1 }, { lastUpdateDate }, { upsert: true }).lean();
    }
    catch (e) {
        index_1.default.logError({
            e,
            func: exports.setLastCurrencyUpdateDate.name,
            path,
        });
        throw e;
    }
};
exports.setLastCurrencyUpdateDate = setLastCurrencyUpdateDate;
const getLastCurrencyUpdateDate = async () => {
    try {
        const lastCurrencyUpdate = await models_1.lastCurrencyUpdateModel.findOne({ id: 1 }).lean();
        return lastCurrencyUpdate?.lastUpdateDate;
    }
    catch (e) {
        index_1.default.logError({
            e,
            func: exports.getLastCurrencyUpdateDate.name,
            path,
        });
        throw e;
    }
};
exports.getLastCurrencyUpdateDate = getLastCurrencyUpdateDate;
