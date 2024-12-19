"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const scamTokenSchema = new mongoose_1.default.Schema({
    address: {
        type: String,
        required: true,
    },
    chainId: {
        type: String,
        required: true,
    },
});
const scamTokenModel = mongoose_1.default.model('scam-token', scamTokenSchema);
exports.default = scamTokenModel;
