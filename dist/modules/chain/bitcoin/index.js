"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const index_1 = __importDefault(require("@utils/index"));
const index_2 = __importDefault(require("@providers/index"));
const index_3 = __importDefault(require("@structures/index"));
const path = index_1.default.getFilePath(__filename);
const getBalance = async (walletAddress) => {
    try {
        const { data } = await axios_1.default.get(`${process.env.BLOCKCHAIN_INFO_API_URL}/q/addressbalance/${walletAddress}`);
        const balance = index_1.default.sathoshiToBtcBalance(data);
        const price = await index_2.default.Coingecko.getCurrentUSDPrice('btc');
        const value = balance * price;
        return [
            {
                name: 'Bitcoin',
                symbol: 'btc',
                balance,
                price,
                logo: 'https://cdn.cdnlogo.com/logos/b/46/bitcoin.svg',
                value,
                chain: index_3.default.Chain.BITCOIN,
                scan: `https://www.blockchain.com/btc/address/${walletAddress}`,
                contractAddress: '',
            },
        ];
    }
    catch (e) {
        index_1.default.logError({
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
