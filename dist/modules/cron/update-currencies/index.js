"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const providers_1 = __importDefault(require("@src/modules/providers"));
const index_1 = __importDefault(require("@utils/index"));
const path = index_1.default.getFilePath(__filename);
const updateCurrencies = async () => {
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= 6000; i++) {
        try {
            await providers_1.default.Coingecko.addOrUpdateCryptoCurrencies(i);
        }
        catch (e) {
            index_1.default.logError({
                func: updateCurrencies.name,
                path,
                e,
            });
            throw e;
        }
    }
};
exports.default = updateCurrencies;
