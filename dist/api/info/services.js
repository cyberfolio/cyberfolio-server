"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectedAccounts = exports.getNetWorth = void 0;
const index_1 = __importDefault(require("@utils/index"));
const services_1 = __importDefault(require("@api/cex/services"));
const repository_1 = __importDefault(require("@api/dex/repository"));
const types_1 = require("@config/types");
const getNetWorth = async ({ keyIdentifier }) => {
    try {
        const dexAssets = await repository_1.default.getAssets({ keyIdentifier });
        let dexTotalValue = 0;
        if (dexAssets) {
            dexTotalValue = dexAssets.reduce((acc, obj) => acc + obj.value, 0);
        }
        const cexAssets = await services_1.default.getAssets({ keyIdentifier });
        let cexTotalValue = 0;
        if (cexAssets) {
            cexTotalValue = cexAssets.reduce((acc, obj) => acc + obj.value, 0);
        }
        return dexTotalValue + cexTotalValue;
    }
    catch (e) {
        const error = index_1.default.onError(e);
        throw error;
    }
};
exports.getNetWorth = getNetWorth;
const getConnectedAccounts = async ({ keyIdentifier, }) => {
    try {
        const wallets = await repository_1.default.getWalletsByKey({
            keyIdentifier,
        });
        const dexAssets = await repository_1.default.getAssets({ keyIdentifier });
        const cexAssets = await services_1.default.getAssets({ keyIdentifier });
        const connectedWallets = wallets.map(({ chain, walletAddress, walletName }) => {
            const netWorth = dexAssets.reduce((acc, dexAsset) => {
                if ((dexAsset.chain === chain && dexAsset.walletAddress === walletAddress) ||
                    (chain === types_1.Chain.ETHEREUM && dexAsset.walletAddress === walletAddress && index_1.default.isEVMChain(dexAsset.chain))) {
                    return acc + dexAsset.value;
                }
                return acc + 0;
            }, 0);
            const scan = index_1.default.getScanUrl(walletAddress, chain);
            return { chain, address: walletAddress, name: walletName, netWorth, scan };
        });
        const cexes = await services_1.default.getAvailableCexes({ keyIdentifier });
        const connectedCexes = cexes.map((cex) => {
            const netWorth = cexAssets.reduce((acc, cexAsset) => {
                if (cexAsset.cexName === cex.cexName) {
                    return acc + cexAsset.value;
                }
                return acc + 0;
            }, 0);
            return {
                name: cex.cexName,
                netWorth,
            };
        });
        const res = {
            cexes: connectedCexes,
            wallets: connectedWallets,
        };
        return res;
    }
    catch (e) {
        const error = index_1.default.onError(e);
        throw error;
    }
};
exports.getConnectedAccounts = getConnectedAccounts;
