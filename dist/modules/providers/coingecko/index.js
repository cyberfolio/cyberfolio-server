"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContractAddress = exports.getLastCurrencyUpdate = exports.getFullNameOfTheCurrency = exports.getCurrentUSDPrice = exports.addOrUpdateCryptoCurrencies = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("@src/utils");
const repository_1 = require("./repository");
const path = (0, utils_1.getFilePath)(__filename);
const addOrUpdateCryptoCurrencies = async (page) => {
    try {
        const response = await (0, axios_1.default)({
            url: `${process.env.COINGECKO_V3_API_URL}/coins/markets?vs_currency=usd&page=${page}`,
            method: 'get',
        });
        await (0, utils_1.sleep)(10000);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cryptoCurrencies = response?.data;
        if (cryptoCurrencies && Array.isArray(cryptoCurrencies)) {
            for (const cryptoCurrency of cryptoCurrencies) {
                if (cryptoCurrency.symbol && cryptoCurrency.current_price) {
                    await (0, repository_1.addOrUpdateCryptoCurrency)({
                        name: cryptoCurrency.name,
                        symbol: cryptoCurrency.symbol?.toLowerCase(),
                        price: parseFloat(cryptoCurrency.current_price),
                        image: cryptoCurrency.image,
                    });
                }
            }
        }
    }
    catch (e) {
        (0, utils_1.logError)({
            e,
            func: exports.addOrUpdateCryptoCurrencies.name,
            path,
        });
        throw e;
    }
};
exports.addOrUpdateCryptoCurrencies = addOrUpdateCryptoCurrencies;
const getCurrentUSDPrice = async (symbol) => {
    const price = await (0, repository_1.getCryptoPriceBySymbol)(symbol);
    return price || 0;
};
exports.getCurrentUSDPrice = getCurrentUSDPrice;
const getFullNameOfTheCurrency = async (symbol) => {
    const fullName = await (0, repository_1.getFullNameOfTheCurrencyBySymbol)(symbol);
    return String(fullName);
};
exports.getFullNameOfTheCurrency = getFullNameOfTheCurrency;
const getLastCurrencyUpdate = async () => (0, repository_1.getLastCurrencyUpdateDate)();
exports.getLastCurrencyUpdate = getLastCurrencyUpdate;
const getContractAddress = async (symbol) => (0, repository_1.getContractAddressOfTheCurrencyBySymbol)(symbol);
exports.getContractAddress = getContractAddress;
