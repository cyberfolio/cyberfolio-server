"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const utils_1 = require("@src/utils");
const coingecko_1 = require("@providers/coingecko");
const types_1 = require("@config/types");
const repository_1 = require("@providers/coingecko/repository");
const types_2 = require("./types");
const API_URL = process.env.BINANCE_API_URL;
const getAssets = async ({ apiKey, apiSecret }) => {
    const queryString = `timestamp=${Date.now()}`;
    const signature = crypto_js_1.default.HmacSHA256(queryString, apiSecret).toString(crypto_js_1.default.enc.Hex);
    try {
        const accountInfo = await axios_1.default.get(`${API_URL}/api/v3/account?${queryString}&signature=${signature}`, {
            headers: {
                'X-MBX-APIKEY': apiKey,
            },
        });
        const assets = accountInfo.data?.balances?.filter((balance) => parseFloat(balance.free) + parseFloat(balance.locked) > 1);
        const response = [];
        if (Array.isArray(assets) && assets.length > 0) {
            for (const asset of assets) {
                const symbol = asset.asset?.toLowerCase();
                const name = await (0, coingecko_1.getFullNameOfTheCurrency)(symbol);
                const price = await (0, coingecko_1.getCurrentUSDPrice)(symbol);
                const balance = parseFloat(asset.free) + parseFloat(asset.locked);
                const contractAddress = await (0, coingecko_1.getContractAddress)(symbol);
                const value = (0, utils_1.roundNumber)(balance * price);
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
                        cexName: types_1.CexName.BINANCE,
                        accountName: types_1.CexName.BINANCE,
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
const getFiatDepositAndWithDrawalHistory = async ({ transactionType, apiKey, apiSecret, }) => {
    const queryString = `transactionType=${transactionType}&timestamp=${Date.now()}&beginTime=${new Date('01.01.2016').getTime()}`;
    const signature = crypto_js_1.default.HmacSHA256(queryString, apiSecret).toString(crypto_js_1.default.enc.Hex);
    try {
        const response = await axios_1.default.get(`${API_URL}/sapi/v1/fiat/orders?${queryString}&signature=${signature}`, {
            headers: {
                'X-MBX-APIKEY': apiKey,
            },
        });
        const { data } = response;
        return data;
    }
    catch (e) {
        if (axios_1.default.isAxiosError(e)) {
            const binanceError = e;
            if (binanceError.response?.data?.msg) {
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
const getFiatPaymentBuyAndSellHistory = async ({ transactionType, apiKey, apiSecret, }) => {
    const queryString = `transactionType=${transactionType}&timestamp=${Date.now()}&beginTime=${new Date('01.01.2016').getTime()}`;
    const signature = crypto_js_1.default.HmacSHA256(queryString, apiSecret).toString(crypto_js_1.default.enc.Hex);
    try {
        const response = await axios_1.default.get(`${API_URL}/sapi/v1/fiat/payments?${queryString}&signature=${signature}`, {
            headers: {
                'X-MBX-APIKEY': apiKey,
            },
        });
        const { data } = response;
        return data;
    }
    catch (e) {
        if (axios_1.default.isAxiosError(e)) {
            const binanceError = e;
            if (binanceError.response?.data?.msg) {
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
const getPaymentHistory = async ({ apiKey, apiSecret }) => {
    const response = [];
    await (0, utils_1.sleep)(2000);
    const creditCardPayment = await getFiatPaymentBuyAndSellHistory({
        apiKey,
        apiSecret,
        transactionType: types_2.TransactionType.DEPOSIT,
    });
    await (0, utils_1.sleep)(3000);
    const bankPayment = await getFiatDepositAndWithDrawalHistory({
        apiKey,
        apiSecret,
        transactionType: types_2.TransactionType.DEPOSIT,
    });
    await (0, utils_1.sleep)(3000);
    const creditCardWithdrawal = await getFiatPaymentBuyAndSellHistory({
        apiKey,
        apiSecret,
        transactionType: types_2.TransactionType.WITHDRAW,
    });
    await (0, utils_1.sleep)(3000);
    const bankWithdrawal = await getFiatDepositAndWithDrawalHistory({
        apiKey,
        apiSecret,
        transactionType: types_2.TransactionType.WITHDRAW,
    });
    const creditCardWithdrawalRes = creditCardWithdrawal.data.map((item) => {
        return {
            cexName: types_1.CexName.BINANCE,
            fiatCurrency: item.fiatCurrency,
            orderNo: item.orderNo,
            type: 'Card Withdrawal',
            status: item.status,
            date: (0, utils_1.timestampToReadableDate)(item.createTime),
            createTime: item.createTime,
            fee: item.totalFee,
            amount: item.obtainAmount,
        };
    });
    const bankWithdrawalRes = bankWithdrawal.data.map((item) => {
        return {
            cexName: types_1.CexName.BINANCE,
            fiatCurrency: item.fiatCurrency,
            orderNo: item.orderNo,
            type: 'Bank Withdrawal',
            status: item.status,
            createTime: item.createTime,
            date: (0, utils_1.timestampToReadableDate)(item.createTime),
            fee: item.totalFee,
            amount: item.amount,
        };
    });
    const bankPaymentRes = bankPayment.data.map((item) => {
        return {
            cexName: types_1.CexName.BINANCE,
            fiatCurrency: item.fiatCurrency,
            orderNo: item.orderNo,
            type: 'Bank Deposit',
            status: item.status,
            createTime: item.createTime,
            date: (0, utils_1.timestampToReadableDate)(item.createTime),
            amount: item.indicatedAmount,
            fee: item.totalFee,
        };
    });
    const creditCardPaymentRes = creditCardPayment.data.map((item) => {
        return {
            cexName: types_1.CexName.BINANCE,
            fiatCurrency: item.fiatCurrency,
            orderNo: item.orderNo,
            type: 'Card Payment',
            status: item.status,
            createTime: item.createTime,
            date: (0, utils_1.timestampToReadableDate)(item.createTime),
            amount: item.sourceAmount,
            fee: item.totalFee,
        };
    });
    response.push(...creditCardPaymentRes, ...bankPaymentRes, ...creditCardWithdrawalRes, ...bankWithdrawalRes);
    const sortedRes = response.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    return sortedRes;
};
exports.default = {
    getAssets,
    getPaymentHistory,
};
