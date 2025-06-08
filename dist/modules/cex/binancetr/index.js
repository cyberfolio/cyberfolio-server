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
const API_URL = process.env.BINANCETR_API_URL;
const getAssets = async ({ apiKey, apiSecret }) => {
    const queryString = `timestamp=${Date.now()}`;
    const signature = crypto_js_1.default.HmacSHA256(queryString, apiSecret).toString(crypto_js_1.default.enc.Hex);
    try {
        const accountInfo = await axios_1.default.get(`${API_URL}/open/v1/account/spot?${queryString}&signature=${signature}`, {
            headers: {
                'X-MBX-APIKEY': apiKey,
            },
        });
        if (accountInfo.data.code === 3700) {
            throw new Error('You provided wrong api key');
        }
        if (accountInfo.data.code === 3702) {
            throw new Error('You provided wrong api secret');
        }
        if (accountInfo.data.code === 404) {
            throw new Error('You provided wrong api key or secret');
        }
        if (accountInfo.data.msg !== 'Success') {
            throw new Error('Something went wrong');
        }
        const assets = accountInfo.data?.data?.accountAssets?.filter((accountAsset) => parseFloat(accountAsset.free) + parseFloat(accountAsset.locked) > 1);
        const response = [];
        if (Array.isArray(assets) && assets.length > 0) {
            for (const asset of assets) {
                const symbol = asset.asset?.toLowerCase();
                const name = await index_2.default.Coingecko.getFullNameOfTheCurrency(symbol);
                const price = await index_2.default.Coingecko.getCurrentUSDPrice(symbol);
                const balance = parseFloat(asset.free) + parseFloat(asset.locked);
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
                        cexName: types_1.CexName.BINANCETR,
                        accountName: types_1.CexName.BINANCETR,
                    });
                }
            }
        }
        return response;
    }
    catch (e) {
        if (axios_1.default.isAxiosError(e)) {
            const binanceError = e;
            if (binanceError.response?.data?.code === -1022) {
                throw new Error('API Secret is invalid');
            }
            if (binanceError.response?.data?.code === -2015) {
                throw new Error('API key is invalid or IP restricted or permissions are missing');
            }
            else if (binanceError.response?.data?.msg) {
                throw new Error(binanceError.response.data.msg);
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
const BinanceTRModule = {
    getAssets,
};
exports.default = BinanceTRModule;
