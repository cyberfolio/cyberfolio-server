"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coingecko_1 = require("@providers/coingecko");
const utils_1 = require("@src/utils");
const path = (0, utils_1.getFilePath)(__filename);
const updateCurrencies = async () => {
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= 6000; i++) {
        try {
            await (0, coingecko_1.addOrUpdateCryptoCurrencies)(i);
        }
        catch (e) {
            (0, utils_1.logError)({
                func: updateCurrencies.name,
                path,
                e,
            });
            throw e;
        }
    }
};
exports.default = updateCurrencies;
