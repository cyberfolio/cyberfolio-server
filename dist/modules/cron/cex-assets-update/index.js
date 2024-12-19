"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@api/auth/repository/models");
const models_2 = require("@api/cex/repository/models");
const binance_1 = __importDefault(require("@cex/binance"));
const gateio_1 = __importDefault(require("@cex/gateio"));
const kucoin_1 = __importDefault(require("@cex/kucoin"));
const binancetr_1 = __importDefault(require("@cex/binancetr"));
const types_1 = require("@config/types");
const utils_1 = require("@src/utils");
const path = (0, utils_1.getFilePath)(__filename);
function getDifference(array1, array2) {
    return array1.filter((object1) => !array2.some((object2) => object1.symbol === object2.symbol && object1.cexName === object2.cexName));
}
const updateCexAssets = async () => {
    try {
        const users = await models_1.userModel.find({}).lean();
        for (const user of users) {
            const walletAddress = user.keyIdentifier;
            const assets = await models_2.cexAssetModel.find({ keyIdentifier: walletAddress }).lean();
            const oldAssets = assets.map((cexAsset) => ({
                symbol: cexAsset.symbol,
                cexName: cexAsset.cexName,
            }));
            const currentAssets = [];
            const availableCexes = await models_2.cexInfoModel.find({ keyIdentifier: walletAddress }).lean();
            for (const availableCex of availableCexes) {
                if (availableCex.cexName === types_1.CexName.BINANCE) {
                    const assets = await binance_1.default.getAssets({
                        apiKey: availableCex.apiKey,
                        apiSecret: availableCex.apiSecret,
                    });
                    currentAssets.push(...assets);
                }
                if (availableCex.cexName === types_1.CexName.KUCOIN) {
                    const assets = await kucoin_1.default.getAssets({
                        apiKey: availableCex.apiKey,
                        apiSecret: availableCex.apiSecret,
                        type: 'main',
                        passphrase: availableCex.passphrase,
                    });
                    currentAssets.push(...assets);
                }
                if (availableCex.cexName === types_1.CexName.GATEIO) {
                    const assets = await gateio_1.default.getAssets({
                        apiKey: availableCex.apiKey,
                        apiSecret: availableCex.apiSecret,
                    });
                    currentAssets.push(...assets);
                }
                if (availableCex.cexName === types_1.CexName.BINANCETR) {
                    const assets = await binancetr_1.default.getAssets({
                        apiKey: availableCex.apiKey,
                        apiSecret: availableCex.apiSecret,
                    });
                    currentAssets.push(...assets);
                }
                (0, utils_1.sleep)(2000);
            }
            const existingAssets = currentAssets.map((cexAsset) => ({
                symbol: cexAsset.symbol,
                cexName: cexAsset.cexName,
            }));
            const assetsThatAreNotOwnedAnymore = [
                ...getDifference(oldAssets, existingAssets),
                ...getDifference(existingAssets, oldAssets),
            ];
            for (const asset of assetsThatAreNotOwnedAnymore) {
                await models_2.cexAssetModel.deleteOne({ keyIdentifier: walletAddress, symbol: asset.symbol, cexName: asset.cexName });
            }
            // Update assets that is owned at this time
            for (const currentAsset of currentAssets) {
                await models_2.cexAssetModel.findOneAndUpdate({ keyIdentifier: walletAddress, symbol: currentAsset.symbol, cexName: currentAsset.cexName }, {
                    balance: currentAsset.balance,
                    price: currentAsset.price,
                    value: currentAsset.value,
                    contractAddress: currentAsset.contractAddress,
                });
            }
            // update last asset update date
            await models_1.userModel.findOneAndUpdate({ keyIdentifier: walletAddress }, { lastAssetUpdate: new Date() });
        }
    }
    catch (e) {
        (0, utils_1.logError)({
            func: updateCexAssets.name,
            path,
            e,
        });
        throw e;
    }
};
exports.default = {
    updateCexAssets,
};
