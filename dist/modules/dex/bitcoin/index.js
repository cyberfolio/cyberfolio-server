"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const utils_1 = __importDefault(require("@src/utils"));
const coingecko_1 = require("@providers/coingecko");
const types_1 = require("@config/types");
const path = utils_1.default.getFilePath(__filename);
const getBalance = async (walletAddress) => {
    try {
        const { data } = await axios_1.default.get(`${process.env.BLOCKCHAIN_INFO_API_URL}/q/addressbalance/${walletAddress}`);
        const balance = utils_1.default.sathoshiToBtcBalance(data);
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
        utils_1.default.logError({
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
