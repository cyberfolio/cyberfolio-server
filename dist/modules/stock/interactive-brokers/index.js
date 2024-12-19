"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("@src/utils");
const path = (0, utils_1.getFilePath)(__filename);
const getStocks = async (walletAddress) => {
    try {
        const response = await axios_1.default.get(`${process.env.INTERACTIVE_BROKERS_API_URL}/api/stocks/${walletAddress}`);
        return response;
    }
    catch (e) {
        (0, utils_1.logError)({
            e,
            func: getStocks.name,
            path,
        });
        throw e;
    }
};
const interactiveBrokers = {
    getStocks,
};
exports.default = interactiveBrokers;
