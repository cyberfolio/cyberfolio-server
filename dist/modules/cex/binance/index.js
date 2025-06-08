"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const index_1 = __importDefault(require("@utils/index"));
const index_2 = __importDefault(require("@providers/index"));
const index_3 = __importDefault(require("@structures/index"));
const types_1 = require("./types");
const BINANCE_API_URL = process.env.BINANCE_API_URL;
const getAssets = async ({ apiKey, apiSecret, }) => {
    const queryString = `timestamp=${Date.now()}`;
    const signature = crypto_js_1.default.HmacSHA256(queryString, apiSecret).toString(crypto_js_1.default.enc.Hex);
    try {
        const accountInfo = await axios_1.default.get(`${BINANCE_API_URL}/api/v3/account?${queryString}&signature=${signature}`, {
            headers: {
                'X-MBX-APIKEY': apiKey,
            },
        });
        const assets = accountInfo.data?.balances?.filter((balance) => parseFloat(balance.free) + parseFloat(balance.locked) > 1);
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
                        cexName: index_3.default.CexName.BINANCE,
                        accountName: index_3.default.CexName.BINANCE,
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
        const response = await axios_1.default.get(`${BINANCE_API_URL}/sapi/v1/fiat/orders?${queryString}&signature=${signature}`, {
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
        const response = await axios_1.default.get(`${BINANCE_API_URL}/sapi/v1/fiat/payments?${queryString}&signature=${signature}`, {
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
    await index_1.default.sleep(2000);
    const creditCardPayment = await getFiatPaymentBuyAndSellHistory({
        apiKey,
        apiSecret,
        transactionType: types_1.TransactionType.DEPOSIT,
    });
    await index_1.default.sleep(3000);
    const bankPayment = await getFiatDepositAndWithDrawalHistory({
        apiKey,
        apiSecret,
        transactionType: types_1.TransactionType.DEPOSIT,
    });
    await index_1.default.sleep(3000);
    const creditCardWithdrawal = await getFiatPaymentBuyAndSellHistory({
        apiKey,
        apiSecret,
        transactionType: types_1.TransactionType.WITHDRAW,
    });
    await index_1.default.sleep(3000);
    const bankWithdrawal = await getFiatDepositAndWithDrawalHistory({
        apiKey,
        apiSecret,
        transactionType: types_1.TransactionType.WITHDRAW,
    });
    const creditCardWithdrawalRes = creditCardWithdrawal.data.map((item) => {
        return {
            cexName: index_3.default.CexName.BINANCE,
            fiatCurrency: item.fiatCurrency,
            orderNo: item.orderNo,
            type: 'Card Withdrawal',
            status: item.status,
            date: index_1.default.timestampToReadableDate(item.createTime),
            createTime: item.createTime,
            fee: item.totalFee,
            amount: item.obtainAmount,
        };
    });
    const bankWithdrawalRes = bankWithdrawal.data.map((item) => {
        return {
            cexName: index_3.default.CexName.BINANCE,
            fiatCurrency: item.fiatCurrency,
            orderNo: item.orderNo,
            type: 'Bank Withdrawal',
            status: item.status,
            createTime: item.createTime,
            date: index_1.default.timestampToReadableDate(item.createTime),
            fee: item.totalFee,
            amount: item.amount,
        };
    });
    const bankPaymentRes = bankPayment.data.map((item) => {
        return {
            cexName: index_3.default.CexName.BINANCE,
            fiatCurrency: item.fiatCurrency,
            orderNo: item.orderNo,
            type: 'Bank Deposit',
            status: item.status,
            createTime: item.createTime,
            date: index_1.default.timestampToReadableDate(item.createTime),
            amount: item.indicatedAmount,
            fee: item.totalFee,
        };
    });
    const creditCardPaymentRes = creditCardPayment.data.map((item) => {
        return {
            cexName: index_3.default.CexName.BINANCE,
            fiatCurrency: item.fiatCurrency,
            orderNo: item.orderNo,
            type: 'Card Payment',
            status: item.status,
            createTime: item.createTime,
            date: index_1.default.timestampToReadableDate(item.createTime),
            amount: item.sourceAmount,
            fee: item.totalFee,
        };
    });
    response.push(...creditCardPaymentRes, ...bankPaymentRes, ...creditCardWithdrawalRes, ...bankWithdrawalRes);
    const sortedRes = response.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    return sortedRes;
};
const BinanceModule = {
    getAssets,
    getPaymentHistory,
};
exports.default = BinanceModule;
