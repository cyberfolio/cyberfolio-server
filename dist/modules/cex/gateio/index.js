"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gate_api_1 = require("gate-api");
const index_1 = __importDefault(require("@providers/index"));
const axios_1 = __importDefault(require("axios"));
const index_2 = __importDefault(require("@structures/index"));
const getAssets = async ({ apiKey, apiSecret, }) => {
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
                    const name = await index_1.default.Coingecko.getFullNameOfTheCurrency(symbol);
                    const contractAddress = await index_1.default.Coingecko.getContractAddress(symbol);
                    balance += lockedBalance;
                    const price = await index_1.default.Coingecko.getCurrentUSDPrice(symbol);
                    const value = balance * price;
                    const logo = symbol ? await index_1.default.Coingecko.getCurrencyLogo(symbol) : '';
                    if (value > 1) {
                        response.push({
                            name,
                            symbol,
                            contractAddress,
                            balance,
                            price,
                            value,
                            logo,
                            cexName: index_2.default.CexName.GATEIO,
                            accountName: index_2.default.CexName.GATEIO,
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
