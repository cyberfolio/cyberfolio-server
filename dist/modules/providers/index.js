"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coingecko_1 = __importDefault(require("./coingecko"));
const coinmarketcap_1 = __importDefault(require("./coinmarketcap"));
const AppProviders = {
    Coingecko: coingecko_1.default,
    Coinmarketcap: coinmarketcap_1.default,
};
exports.default = AppProviders;
