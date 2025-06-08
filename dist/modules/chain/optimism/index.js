"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const index_1 = __importDefault(require("@utils/index"));
const index_2 = __importDefault(require("@structures/index"));
const evmAssetsResponse_1 = __importDefault(require("@modules/chain/common/evmAssetsResponse"));
const index_3 = __importDefault(require("@constants/index"));
const path = index_1.default.getFilePath(__filename);
const getTokenBalances = async (walletAddress) => {
    try {
        const walletInfo = await axios_1.default.get(`${process.env.COVALENT_V1_API_URL}/${index_3.default.ChainIDs.OPTIMISM}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`);
        const assets = walletInfo.data.data.items;
        const response = await (0, evmAssetsResponse_1.default)(walletAddress, index_2.default.ScanURL.OPTIMISM, assets, index_2.default.Chain.OPTIMISM);
        return response;
    }
    catch (e) {
        index_1.default.logError({
            e,
            func: getTokenBalances.name,
            path,
        });
        throw e;
    }
};
const optimism = {
    getTokenBalances,
};
exports.default = optimism;
