"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gate_api_1 = require("gate-api");
const coingecko_1 = require("@providers/coingecko");
const axios_1 = __importDefault(require("axios"));
const types_1 = require("@config/types");
const repository_1 = require("@providers/coingecko/repository");
const getAssets = async ({ apiKey, apiSecret }) => {
    const client = new gate_api_1.ApiClient();
    client.setApiKeySecret(apiKey, apiSecret);
    const spotApi = new gate_api_1.SpotApi(client);
    try {
        const accounts = await spotApi.listSpotAccounts({ currency: undefined });
        const assets = accounts?.body;
        const response = [];
        if (assets && assets.length > 0) {
            for (const asset of assets) {
                const { available } = asset;
                const { locked } = asset;
                let balance = parseFloat(available || '0');
                const lockedBalance = parseFloat(locked || '0');
                if (balance > 0.5 || lockedBalance > 0.5) {
                    const symbol = String(asset?.currency).toLowerCase();
                    const name = await (0, coingecko_1.getFullNameOfTheCurrency)(symbol);
                    const contractAddress = await (0, coingecko_1.getContractAddress)(symbol);
                    balance += lockedBalance;
                    const price = await (0, coingecko_1.getCurrentUSDPrice)(symbol);
                    const value = balance * price;
                    const logo = symbol ? await (0, repository_1.getCurrencyLogo)(symbol) : '';
                    if (value > 1) {
                        response.push({
                            name,
                            symbol,
                            contractAddress,
                            balance,
                            price,
                            value,
                            logo,
                            cexName: types_1.CexName.GATEIO,
                            accountName: types_1.CexName.GATEIO,
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
            if (gateIoError.response?.data?.code) {
                throw new Error(gateIoError.response.data.code);
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
const GateioModule = {
    getAssets,
};
exports.default = GateioModule;
