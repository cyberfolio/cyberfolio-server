"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@src/utils");
const axios_1 = __importDefault(require("axios"));
const apiKey = process.env.COINMARKETCAP_API_KEY;
const path = (0, utils_1.getFilePath)(__filename);
const getCryptoCurrencyLogo = async ({ symbol }) => {
    try {
        const response = await axios_1.default.get(`${process.env.COINMARKETCAP_API_URL}/cryptocurrency/info?symbol=${symbol}`, {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
            },
        });
        await (0, utils_1.sleep)(200);
        if (response.data.data[symbol.toUpperCase()].logo) {
            return response.data.data[symbol.toUpperCase()].logo;
        }
        return undefined;
    }
    catch (e) {
        (0, utils_1.logError)({
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
