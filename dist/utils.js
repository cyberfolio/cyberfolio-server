"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-promise-executor-return */
/* eslint-disable promise/avoid-new */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
const web3_1 = __importDefault(require("web3"));
const ethers_1 = require("ethers");
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("@config/logger"));
const lodash_1 = __importDefault(require("lodash"));
const types_1 = require("@config/types");
const model_1 = __importDefault(require("./modules/cron/scam-tokens/model"));
const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(`${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const isValid0xAddress = (address) => web3.utils.isAddress(address);
const formatBalance = (balance, decimals) => ethers_1.ethers.formatUnits(balance, Number(decimals));
const sathoshiToBtcBalance = (satoshi) => satoshi * 0.00000001;
const toBase64 = (string) => Buffer.from(string).toString('base64');
const getScanUrl = (address, chain) => {
    switch (chain) {
        case types_1.Chain.ARBITRUM:
            return `${types_1.ScanURL.ARBITRUM}/address/${address}`;
        case types_1.Chain.AVALANCHE:
            return `${types_1.ScanURL.AVALANCHE}/address/${address}`;
        case types_1.Chain.BITCOIN:
            return `${types_1.ScanURL.BITCOIN}/btc/address/${address}`;
        case types_1.Chain.BSC:
            return `${types_1.ScanURL.BSC}/address/${address}`;
        case types_1.Chain.ETHEREUM:
            return `${types_1.ScanURL.ETHEREUM}/address/${address}`;
        case types_1.Chain.OPTIMISM:
            return `${types_1.ScanURL.OPTIMISM}/address/${address}`;
        case types_1.Chain.POLYGON:
            return `${types_1.ScanURL.POLYGON}/address/${address}`;
        case types_1.Chain.SOLANA:
            return `${types_1.ScanURL.SOLANA}address/${address}`;
        default:
            return '';
    }
};
const intDivide = (numerator, denominator) => Number((numerator / denominator).toString().split('.')[0]);
const generateNonce = () => `I confirm that I'm the owner of this wallet by signing this message: ${(0, uuid_1.v4)()}`;
const doesImageExists = async (url) => {
    try {
        await (0, axios_1.default)({
            url,
            method: 'get',
        });
        return true;
    }
    catch (e) {
        return false;
    }
};
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
const roundNumber = (num) => Math.round((num + Number.EPSILON) * 100) / 100;
const onError = (e) => {
    let error;
    if (e instanceof Error) {
        error = e;
    }
    else {
        logger_1.default.error('Unexpected error', e);
        error = new Error('Unexpected error');
    }
    return error;
};
const isEVMChain = (chain) => {
    return (chain === types_1.Chain.ARBITRUM ||
        chain === types_1.Chain.AVALANCHE ||
        chain === types_1.Chain.BSC ||
        chain === types_1.Chain.OPTIMISM ||
        chain === types_1.Chain.POLYGON ||
        chain === types_1.Chain.ETHEREUM);
};
const logError = ({ path, func, e }) => {
    let message;
    if (axios_1.default.isAxiosError(e)) {
        message = e.response?.data ? JSON.stringify(e.response?.data, null, 2) : e.response?.statusText;
    }
    else if (e instanceof Error) {
        message = e.message ? e.message : String(e);
    }
    else {
        message = e;
    }
    logger_1.default.error(`Error at ${path} ${func} message: ${message}`);
};
const getFilePath = (path) => {
    const fileName = path.substring(path.indexOf('src'));
    return fileName;
};
const removeMongoFields = (object) => {
    if (Object.prototype.toString.call(object) !== '[object Object]')
        return object;
    const obj = lodash_1.default.cloneDeep(object);
    delete obj._id;
    delete obj.__v;
    return obj;
};
const isScamToken = async (address, chainId) => {
    const isScam = await model_1.default.findOne({ address, chainId });
    return Boolean(isScam);
};
function isEnumOf(object, possibleValue) {
    return Object.values(object).includes(possibleValue);
}
const timestampToReadableDate = (timestamp) => {
    const date = new Date(timestamp);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    month = (month < 10 ? '0' : '') + month;
    day = (day < 10 ? '0' : '') + day;
    hour = (hour < 10 ? '0' : '') + hour;
    min = (min < 10 ? '0' : '') + min;
    sec = (sec < 10 ? '0' : '') + sec;
    const str = `${day}/${month}/${date.getFullYear()} ${hour}:${min}:${sec}`;
    return str;
};
const AppUtils = {
    sleep,
    isValid0xAddress,
    formatBalance,
    sathoshiToBtcBalance,
    toBase64,
    getScanUrl,
    intDivide,
    generateNonce,
    doesImageExists,
    capitalizeFirstLetter,
    roundNumber,
    onError,
    isEVMChain,
    logError,
    getFilePath,
    removeMongoFields,
    isScamToken,
    isEnumOf,
    timestampToReadableDate,
};
exports.default = AppUtils;
