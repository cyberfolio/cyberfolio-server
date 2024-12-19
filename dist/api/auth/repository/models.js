"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    keyIdentifier: {
        type: String,
        required: true,
        unique: true,
    },
    nonce: {
        type: String,
        required: true,
        unique: true,
    },
    ensName: {
        type: String,
    },
    lastAssetUpdate: {
        type: Date,
        required: false,
    },
});
exports.userModel = mongoose_1.default.model('user', userSchema);
