"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenBalances = exports.getEthBalance = exports.isValidEthAddress = void 0;
const web3_1 = __importDefault(require("web3"));
const axios_1 = __importDefault(require("axios"));
const web3_validator_1 = __importDefault(require("web3-validator"));
const index_1 = __importDefault(require("@utils/index"));
const index_2 = __importDefault(require("@structures/index"));
const evmAssetsResponse_1 = __importDefault(require("@modules/chain/common/evmAssetsResponse"));
const index_3 = __importDefault(require("@constants/index"));
const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(`${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`));
const isValidEthAddress = (address) => web3_validator_1.default.isAddress(address);
exports.isValidEthAddress = isValidEthAddress;
const path = index_1.default.getFilePath(__filename);
const getEthBalance = async (walletAddress) => {
    try {
        const balance = await web3.eth.getBalance(walletAddress);
        return web3.utils.fromWei(balance, 'ether');
    }
    catch (e) {
        index_1.default.logError({
            e,
            func: exports.getEthBalance.name,
            path,
        });
        throw e;
    }
};
exports.getEthBalance = getEthBalance;
const getTokenBalances = async (walletAddress) => {
    try {
        const walletInfo = await axios_1.default.get(`${process.env.COVALENT_V1_API_URL}/${index_3.default.ChainIDs.ETHEREUM}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`);
        const assets = walletInfo.data.data.items;
        const response = await (0, evmAssetsResponse_1.default)(walletAddress, index_2.default.ScanURL.ETHEREUM, assets, index_2.default.Chain.ETHEREUM);
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
const ethereum = {
    getEthBalance: exports.getEthBalance,
    getTokenBalances: exports.getTokenBalances,
};
exports.default = ethereum;
