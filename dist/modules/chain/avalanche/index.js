"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenBalances = void 0;
const axios_1 = __importDefault(require("axios"));
const index_1 = __importDefault(require("@utils/index"));
const evmAssetsResponse_1 = __importDefault(require("@modules/chain/common/evmAssetsResponse"));
const index_2 = __importDefault(require("@structures/index"));
const index_3 = __importDefault(require("@constants/index"));
const path = index_1.default.getFilePath(__filename);
const getTokenBalances = async (walletAddress) => {
    try {
        const walletInfo = await axios_1.default.get(`${process.env.COVALENT_V1_API_URL}/${index_3.default.ChainIDs.AVALANCHE_CCHAIN}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`);
        const assets = walletInfo.data.data.items;
        const response = await (0, evmAssetsResponse_1.default)(walletAddress, index_2.default.ScanURL.AVALANCHE, assets, index_2.default.Chain.AVALANCHE);
        return response;
    }
    catch (e) {
        index_1.default.logError({
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
