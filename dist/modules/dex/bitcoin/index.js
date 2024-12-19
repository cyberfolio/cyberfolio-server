"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("@src/utils");
const coingecko_1 = require("@providers/coingecko");
const types_1 = require("@config/types");
const path = (0, utils_1.getFilePath)(__filename);
const getBalance = async (walletAddress) => {
    try {
        const { data } = await axios_1.default.get(`${process.env.BLOCKCHAIN_INFO_API_URL}/q/addressbalance/${walletAddress}`);
        const balance = (0, utils_1.sathoshiToBtcBalance)(data);
        const price = await (0, coingecko_1.getCurrentUSDPrice)('btc');
        const value = balance * price;
        return [
            {
                name: 'Bitcoin',
                symbol: 'btc',
                balance,
                price,
                logo: 'https://cdn.cdnlogo.com/logos/b/46/bitcoin.svg',
                value,
                chain: types_1.Chain.BITCOIN,
                scan: `https://www.blockchain.com/btc/address/${walletAddress}`,
                contractAddress: '',
            },
        ];
    }
    catch (e) {
        (0, utils_1.logError)({
            e,
            func: getBalance.name,
            path,
        });
        throw e;
    }
};
const bitcoin = {
    getBalance,
};
exports.default = bitcoin;
