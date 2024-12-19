"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@config/types");
const EvmWithChain = {
    Bitcoin: {
        name: types_1.Platform.BITCOIN,
        chainId: '-1',
    },
    Solana: {
        name: types_1.Platform.SOLANA,
        chainId: '-1',
    },
    Polkadot: {
        name: types_1.Platform.POLKADOT,
        chainId: '-1',
    },
    Binance: {
        name: types_1.Platform.BINANCE,
        chainId: '-1',
    },
    Gateio: {
        name: types_1.Platform.GATEIO,
        chainId: '-1',
    },
    Kucoin: {
        name: types_1.Platform.KUCOIN,
        chainId: '-1',
    },
    Ethereum: {
        name: types_1.Platform.ETHEREUM,
        chainId: '1',
    },
    SmartChain: {
        name: types_1.Platform.BSC,
        chainId: '56',
    },
    Avalanche: {
        name: types_1.Platform.AVALANCHE,
        chainId: '43114',
    },
    Polygon: {
        name: types_1.Platform.POLYGON,
        chainId: '137',
    },
    Arbitrum: {
        name: types_1.Platform.ARBITRUM,
        chainId: '42161',
    },
    Optimism: {
        name: types_1.Platform.OPTIMISM,
        chainId: '10',
    },
};
const constants = {
    EvmWithChain,
};
exports.default = constants;
