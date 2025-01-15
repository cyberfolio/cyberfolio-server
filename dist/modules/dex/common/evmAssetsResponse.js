"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("@src/utils"));
const repository_1 = require("@providers/coingecko/repository");
const types_1 = require("@config/types");
const index_1 = __importDefault(require("@constants/index"));
const path = utils_1.default.getFilePath(__filename);
const evmAssetsResponse = async (walletAddress, scanURL, assets, chain) => {
    const response = [];
    if (!assets || !Array.isArray(assets))
        return response;
    for (const asset of assets) {
        try {
            const contractAddress = asset.contract_address?.toLowerCase();
            const { chainId } = index_1.default.EvmWithChain[chain];
            const isScam = await utils_1.default.isScamToken(contractAddress, chainId);
            if (Number(asset.balance) > 0) {
                let balance = Number(utils_1.default.formatBalance(asset.balance, asset.contract_decimals));
                if (contractAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
                    balance = parseFloat(balance.toFixed(5));
                }
                else {
                    balance = parseFloat(balance.toFixed(3));
                }
                const name = asset.contract_name;
                const price = asset.quote_rate;
                if (price === null) {
                    continue;
                }
                const value = balance * price;
                const symbol = asset.contract_ticker_symbol?.toLowerCase();
                const logo = symbol ? await (0, repository_1.getCurrencyLogo)(symbol) : '';
                let scan = '';
                if (scanURL === types_1.ScanURL.SOLANA && contractAddress !== '11111111111111111111111111111111') {
                    scan = `${scanURL}/address/${walletAddress}/tokens`;
                }
                else if (scanURL === types_1.ScanURL.SOLANA && contractAddress === '11111111111111111111111111111111') {
                    scan = `${scanURL}/address/${walletAddress}`;
                }
                else if (contractAddress && contractAddress !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
                    scan = `${scanURL}/token/${contractAddress}?a=${walletAddress}`;
                }
                else {
                    scan = `${scanURL}/address/${walletAddress}`;
                }
                if (symbol?.toLowerCase() === 'uni-v2' || price > 200000 || balance === 0) {
                    continue;
                }
                if (price && symbol && !isScam) {
                    response.push({
                        name,
                        symbol,
                        contractAddress,
                        logo,
                        balance,
                        price,
                        value,
                        chain,
                        scan,
                    });
                }
            }
        }
        catch (e) {
            utils_1.default.logError({
                e,
                func: evmAssetsResponse.name,
                path,
            });
            throw e;
        }
    }
    return response;
};
exports.default = evmAssetsResponse;
