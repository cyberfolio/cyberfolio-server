"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const arbitrum_1 = __importDefault(require("./arbitrum"));
const avalanche_1 = __importDefault(require("./avalanche"));
const ethereum_1 = __importDefault(require("./ethereum"));
const optimism_1 = __importDefault(require("./optimism"));
const polygon_1 = __importDefault(require("./polygon"));
const smartchain_1 = __importDefault(require("./smartchain"));
const solana_1 = __importDefault(require("./solana"));
const bitcoin_1 = __importDefault(require("./bitcoin"));
const Chain = {
    Bitcoin: bitcoin_1.default,
    Arbitrum: arbitrum_1.default,
    Avalanche: avalanche_1.default,
    Ethereum: ethereum_1.default,
    Optimism: optimism_1.default,
    Polygon: polygon_1.default,
    SmartChain: smartchain_1.default,
    Solana: solana_1.default,
};
exports.default = Chain;
