"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenBalances = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("@src/utils");
const evmAssetsResponse_1 = __importDefault(require("@dex/common/evmAssetsResponse"));
const types_1 = require("@config/types");
const constants_1 = __importDefault(require("@config/constants"));
const path = (0, utils_1.getFilePath)(__filename);
const getTokenBalances = async (walletAddress) => {
    try {
        const walletInfo = await axios_1.default.get(`${process.env.COVALENT_V1_API_URL}/${constants_1.default.ChainIDs.AVALANCHE_CCHAIN}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`);
        const assets = walletInfo.data.data.items;
        const response = await (0, evmAssetsResponse_1.default)(walletAddress, types_1.ScanURL.AVALANCHE, assets, types_1.Chain.AVALANCHE);
        return response;
    }
    catch (e) {
        (0, utils_1.logError)({
            e,
            func: exports.getTokenBalances.name,
            path,
        });
        throw e;
    }
};
exports.getTokenBalances = getTokenBalances;
const avalanche = {
    getTokenBalances: exports.getTokenBalances,
};
exports.default = avalanche;
