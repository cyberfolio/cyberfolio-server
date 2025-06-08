"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@api/auth/repository/models");
const models_2 = require("@api/cex/repository/models");
const modules_1 = __importDefault(require("@src/modules"));
const index_1 = __importDefault(require("@structures/index"));
const utils_1 = __importDefault(require("@src/utils"));
const path = utils_1.default.getFilePath(__filename);
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
                if (availableCex.cexName === index_1.default.CexName.BINANCE) {
                    const assets = await modules_1.default.Binance.getAssets({
                        apiKey: availableCex.apiKey,
                        apiSecret: availableCex.apiSecret,
                    });
                    currentAssets.push(...assets);
                }
                if (availableCex.cexName === index_1.default.CexName.KUCOIN) {
                    const assets = await modules_1.default.Kucoin.getAssets({
                        apiKey: availableCex.apiKey,
                        apiSecret: availableCex.apiSecret,
                        type: 'main',
                        passphrase: availableCex.passphrase,
                    });
                    currentAssets.push(...assets);
                }
                if (availableCex.cexName === index_1.default.CexName.GATEIO) {
                    const assets = await modules_1.default.Gateio.getAssets({
                        apiKey: availableCex.apiKey,
                        apiSecret: availableCex.apiSecret,
                    });
                    currentAssets.push(...assets);
                }
                if (availableCex.cexName === index_1.default.CexName.BINANCETR) {
                    const assets = await modules_1.default.BinanceTR.getAssets({
                        apiKey: availableCex.apiKey,
                        apiSecret: availableCex.apiSecret,
                    });
                    currentAssets.push(...assets);
                }
                utils_1.default.sleep(2000);
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
        utils_1.default.logError({
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
