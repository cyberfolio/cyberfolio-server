"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const binance_1 = __importDefault(require("@cex/binance"));
const kucoin_1 = __importDefault(require("@cex/kucoin"));
const gateio_1 = __importDefault(require("@cex/gateio"));
const binancetr_1 = __importDefault(require("@cex/binancetr"));
const chain_1 = __importDefault(require("./chain"));
const AppModules = {
    Binance: binance_1.default,
    Kucoin: kucoin_1.default,
    Gateio: gateio_1.default,
    BinanceTR: binancetr_1.default,
    Chain: chain_1.default,
};
exports.default = AppModules;
