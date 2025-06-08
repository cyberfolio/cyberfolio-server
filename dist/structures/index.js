"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppStructures;
(function (AppStructures) {
    let Chain;
    (function (Chain) {
        Chain["BITCOIN"] = "Bitcoin";
        Chain["ETHEREUM"] = "Ethereum";
        Chain["BSC"] = "SmartChain";
        Chain["AVALANCHE"] = "Avalanche";
        Chain["SOLANA"] = "Solana";
        Chain["POLKADOT"] = "Polkadot";
        Chain["POLYGON"] = "Polygon";
        Chain["ARBITRUM"] = "Arbitrum";
        Chain["OPTIMISM"] = "Optimism";
    })(Chain = AppStructures.Chain || (AppStructures.Chain = {}));
    let Platform;
    (function (Platform) {
        Platform["BITCOIN"] = "Bitcoin";
        Platform["ETHEREUM"] = "Ethereum";
        Platform["BSC"] = "SmartChain";
        Platform["AVALANCHE"] = "Avalanche";
        Platform["SOLANA"] = "Solana";
        Platform["POLKADOT"] = "Polkadot";
        Platform["POLYGON"] = "Polygon";
        Platform["ARBITRUM"] = "Arbitrum";
        Platform["OPTIMISM"] = "Optimism";
        Platform["BINANCE"] = "Binance";
        Platform["GATEIO"] = "Gateio";
        Platform["KUCOIN"] = "Kucoin";
    })(Platform = AppStructures.Platform || (AppStructures.Platform = {}));
    let CexName;
    (function (CexName) {
        CexName["BINANCE"] = "Binance";
        CexName["BINANCETR"] = "BinanceTR";
        CexName["GATEIO"] = "Gateio";
        CexName["KUCOIN"] = "Kucoin";
    })(CexName = AppStructures.CexName || (AppStructures.CexName = {}));
    let ScanURL;
    (function (ScanURL) {
        ScanURL["ETHEREUM"] = "https://etherscan.io";
        ScanURL["BSC"] = "https://bscscan.com";
        ScanURL["BITCOIN"] = "https://www.blockchain.com";
        ScanURL["AVALANCHE"] = "https://snowtrace.io";
        ScanURL["POLYGON"] = "https://polygonscan.com";
        ScanURL["ARBITRUM"] = "https://arbiscan.io";
        ScanURL["OPTIMISM"] = "https://optimistic.etherscan.io";
        ScanURL["SOLANA"] = "https://explorer.solana.com";
    })(ScanURL = AppStructures.ScanURL || (AppStructures.ScanURL = {}));
})(AppStructures || (AppStructures = {}));
// Merge everything under one object
// export default {
//   ...User,
// } as typeof User & UserTypes;
exports.default = AppStructures;
