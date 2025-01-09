"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coingecko_1 = require("@providers/coingecko");
const utils_1 = __importDefault(require("@src/utils"));
const path = utils_1.default.getFilePath(__filename);
const updateCurrencies = async () => {
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= 6000; i++) {
        try {
            await (0, coingecko_1.addOrUpdateCryptoCurrencies)(i);
        }
        catch (e) {
            utils_1.default.logError({
                func: updateCurrencies.name,
                path,
                e,
            });
            throw e;
        }
    }
};
exports.default = updateCurrencies;
