"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanURL = exports.CexName = exports.Platform = exports.Chain = void 0;
var Chain;
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
})(Chain || (exports.Chain = Chain = {}));
var Platform;
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
})(Platform || (exports.Platform = Platform = {}));
var CexName;
(function (CexName) {
    CexName["BINANCE"] = "Binance";
    CexName["BINANCETR"] = "BinanceTR";
    CexName["GATEIO"] = "Gateio";
    CexName["KUCOIN"] = "Kucoin";
})(CexName || (exports.CexName = CexName = {}));
var ScanURL;
(function (ScanURL) {
    ScanURL["ETHEREUM"] = "https://etherscan.io";
    ScanURL["BSC"] = "https://bscscan.com";
    ScanURL["BITCOIN"] = "https://www.blockchain.com";
    ScanURL["AVALANCHE"] = "https://snowtrace.io";
    ScanURL["POLYGON"] = "https://polygonscan.com";
    ScanURL["ARBITRUM"] = "https://arbiscan.io";
    ScanURL["OPTIMISM"] = "https://optimistic.etherscan.io";
    ScanURL["SOLANA"] = "https://explorer.solana.com";
})(ScanURL || (exports.ScanURL = ScanURL = {}));
