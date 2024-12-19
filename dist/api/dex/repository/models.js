"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dexAssetModel = exports.walletsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const walletSchema = new mongoose_1.default.Schema({
    keyIdentifier: { type: String, required: true },
    walletAddress: { type: String, required: true },
    walletName: { type: String, required: true },
    chain: { type: String, required: true },
});
exports.walletsModel = mongoose_1.default.model('wallet', walletSchema);
const dexAssetSchema = new mongoose_1.default.Schema({
    keyIdentifier: { type: String, required: true },
    chain: { type: String, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    logo: { type: String, required: true },
    balance: { type: Number, required: true },
    price: { type: Number, required: true },
    value: { type: Number, required: true },
    walletName: { type: String, required: true },
    walletAddress: { type: String, required: true },
    contractAddress: { type: String },
    scan: { type: String },
});
exports.dexAssetModel = mongoose_1.default.model('dex-asset', dexAssetSchema);
