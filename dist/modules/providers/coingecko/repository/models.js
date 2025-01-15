"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lastCurrencyUpdateModel = exports.currencyModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const currencySchema = new mongoose_1.default.Schema({
    name: String,
    symbol: String,
    contractAddress: String,
    price: Number,
    logo: String,
});
exports.currencyModel = mongoose_1.default.model('currency', currencySchema);
const lastCurrencyUpdateSchema = new mongoose_1.default.Schema({
    id: Number,
    lastUpdateDate: Date,
});
exports.lastCurrencyUpdateModel = mongoose_1.default.models.LastCurrencyUpdateDoc ||
    mongoose_1.default.model('last-currency-update', lastCurrencyUpdateSchema);
