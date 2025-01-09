"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("@src/utils"));
const axios_1 = __importDefault(require("axios"));
const apiKey = process.env.COINMARKETCAP_API_KEY;
const path = utils_1.default.getFilePath(__filename);
const getCryptoCurrencyLogo = async ({ symbol }) => {
    try {
        const response = await axios_1.default.get(`${process.env.COINMARKETCAP_API_URL}/cryptocurrency/info?symbol=${symbol}`, {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
            },
        });
        await utils_1.default.sleep(200);
        if (response.data.data[symbol.toUpperCase()].logo) {
            return response.data.data[symbol.toUpperCase()].logo;
        }
        return undefined;
    }
    catch (e) {
        utils_1.default.logError({
            path,
            e,
            func: getCryptoCurrencyLogo.name,
        });
        return undefined;
    }
};
const coinmarketcapProider = {
    getCryptoCurrencyLogo,
};
exports.default = coinmarketcapProider;
