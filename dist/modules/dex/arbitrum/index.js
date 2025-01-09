"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const utils_1 = __importDefault(require("@src/utils"));
const evmAssetsResponse_1 = __importDefault(require("@dex/common/evmAssetsResponse"));
const types_1 = require("@config/types");
const constants_1 = __importDefault(require("@config/constants"));
const path = utils_1.default.getFilePath(__filename);
const getTokenBalances = async (walletAddress) => {
    try {
        const walletInfo = await axios_1.default.get(`${process.env.COVALENT_V1_API_URL}/${constants_1.default.ChainIDs.ARBITRUM}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`);
        const assets = walletInfo.data.data.items;
        const response = await (0, evmAssetsResponse_1.default)(walletAddress, types_1.ScanURL.ARBITRUM, assets, types_1.Chain.ARBITRUM);
        return response;
    }
    catch (e) {
        utils_1.default.logError({
            e,
            func: getTokenBalances.name,
            path,
        });
        throw e;
    }
};
const arbitrum = {
    getTokenBalances,
};
exports.default = arbitrum;
