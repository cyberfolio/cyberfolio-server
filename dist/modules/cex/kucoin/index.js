"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const index_1 = __importDefault(require("@utils/index"));
const index_2 = __importDefault(require("@providers/index"));
const types_1 = require("@config/types");
const API_VERSION = process.env.KUCOIN_API_VERSION;
const API_URL = process.env.KUCOIN_API_URL;
const getAssets = async ({ type, apiKey, apiSecret, passphrase, }) => {
    const timestamp = Date.now().toString();
    const endpoint = `/api/v1/accounts?type=${type}`;
    const stringToSign = `${timestamp}GET${endpoint}`;
    const signedString = crypto_js_1.default.HmacSHA256(stringToSign, apiSecret).toString(crypto_js_1.default.enc.Base64);
    const encryptedApiVersion = crypto_js_1.default.HmacSHA256(API_VERSION, apiSecret).toString(crypto_js_1.default.enc.Base64);
    try {
        const accountInfo = await axios_1.default.get(`${API_URL}${endpoint}`, {
            headers: {
                'KC-API-KEY': apiKey,
                'KC-API-SIGN': signedString,
                'KC-API-TIMESTAMP': timestamp,
                'KC-API-PASSPHRASE': passphrase,
                'KC-API-KEY-VERSION': encryptedApiVersion,
            },
        });
        const assets = accountInfo?.data?.data;
        const response = [];
        if (assets && assets.length > 0) {
            for (const asset of assets) {
                const balance = index_1.default.roundNumber(Number(asset.holds));
                if (balance > 0) {
                    const symbol = asset.currency?.toLowerCase();
                    const price = await index_2.default.Coingecko.getCurrentUSDPrice(symbol);
                    const name = await index_2.default.Coingecko.getFullNameOfTheCurrency(symbol);
                    const contractAddress = await index_2.default.Coingecko.getContractAddress(symbol);
                    const value = index_1.default.roundNumber(balance * price);
                    const logo = symbol ? await index_2.default.Coingecko.getCurrencyLogo(symbol) : '';
                    if (value > 1) {
                        response.push({
                            name,
                            symbol,
                            contractAddress,
                            balance,
                            price,
                            value,
                            logo,
                            cexName: types_1.CexName.KUCOIN,
                            accountName: types_1.CexName.KUCOIN,
                        });
                    }
                }
            }
        }
        return response;
    }
    catch (e) {
        if (axios_1.default.isAxiosError(e)) {
            const gateIoError = e;
            if (gateIoError.response?.data?.code === '400003') {
                throw new Error('Api key or secret is not valid.');
            }
            else if (gateIoError.response?.data?.code === '400005') {
                throw new Error('Server error, please contact the admin.');
            }
            else {
                throw new Error(e.message);
            }
        }
        else {
            throw e;
        }
    }
};
const KucoinModule = {
    getAssets,
};
exports.default = KucoinModule;
