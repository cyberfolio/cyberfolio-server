"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const index_1 = __importDefault(require("@utils/index"));
const repository_1 = require("./repository");
const path = index_1.default.getFilePath(__filename);
const addOrUpdateCryptoCurrencies = async (page) => {
    try {
        const response = await (0, axios_1.default)({
            url: `${process.env.COINGECKO_V3_API_URL}/coins/markets?vs_currency=usd&page=${page}`,
            method: 'get',
        });
        await index_1.default.sleep(10000);
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
        index_1.default.logError({
            e,
            func: addOrUpdateCryptoCurrencies.name,
            path,
        });
        throw e;
    }
};
const getCurrentUSDPrice = async (symbol) => {
    const price = await (0, repository_1.getCryptoPriceBySymbol)(symbol);
    return price || 0;
};
const getFullNameOfTheCurrency = async (symbol) => {
    const fullName = await (0, repository_1.getFullNameOfTheCurrencyBySymbol)(symbol);
    return String(fullName);
};
const getLastCurrencyUpdate = async () => (0, repository_1.getLastCurrencyUpdateDate)();
const getContractAddress = async (symbol) => (0, repository_1.getContractAddressOfTheCurrencyBySymbol)(symbol);
const CoingeckoProvider = {
    addOrUpdateCryptoCurrencies,
    getCurrentUSDPrice,
    getFullNameOfTheCurrency,
    getLastCurrencyUpdate,
    getContractAddress,
    getCurrencyLogo: repository_1.getCurrencyLogo,
};
exports.default = CoingeckoProvider;
