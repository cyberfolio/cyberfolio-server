"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cexPaymentHistoryModel = exports.cexAssetModel = exports.cexInfoModel = void 0;
const types_1 = require("@config/types");
const mongoose_1 = __importDefault(require("mongoose"));
const cexInfoSchema = new mongoose_1.default.Schema({
    keyIdentifier: String,
    apiKey: String,
    apiSecret: String,
    cexName: {
        type: String,
        enum: types_1.CexName,
    },
    passphrase: String,
});
exports.cexInfoModel = mongoose_1.default.models.CexInfo || mongoose_1.default.model('cex-info', cexInfoSchema);
const cexAssetSchema = new mongoose_1.default.Schema({
    keyIdentifier: String,
    cexName: {
        type: String,
        enum: types_1.CexName,
    },
    name: String,
    symbol: String,
    logo: String,
    balance: Number,
    price: Number,
    value: Number,
    accountName: String,
});
exports.cexAssetModel = mongoose_1.default.models.CexAsset || mongoose_1.default.model('cex-asset', cexAssetSchema);
const cexPaymentHistorySchema = new mongoose_1.default.Schema({
    keyIdentifier: {
        type: String,
        required: true,
    },
    orderNo: {
        type: String,
        required: true,
    },
    cexName: {
        type: String,
        enum: types_1.CexName,
    },
    type: {
        type: String,
        required: true,
    },
    fee: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    createTime: {
        type: Number,
        required: true,
    },
    fiatCurrency: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
});
exports.cexPaymentHistoryModel = mongoose_1.default.models.CexPaymentHistory ||
    mongoose_1.default.model('cex-payment-history', cexPaymentHistorySchema);
