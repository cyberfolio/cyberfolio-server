"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@api/auth/repository/models");
const models_2 = require("@api/dex/repository/models");
const index_1 = __importDefault(require("@structures/index"));
const arbitrum_1 = __importDefault(require("@modules/chain/arbitrum"));
const avalanche_1 = __importDefault(require("@modules/chain/avalanche"));
const ethereum_1 = __importDefault(require("@modules/chain/ethereum"));
const optimism_1 = __importDefault(require("@modules/chain/optimism"));
const polygon_1 = __importDefault(require("@modules/chain/polygon"));
const smartchain_1 = __importDefault(require("@modules/chain/smartchain"));
const index_2 = __importDefault(require("@utils/index"));
const path = index_2.default.getFilePath(__filename);
function getDifference(array1, array2) {
    return array1.filter((object1) => !array2.some((object2) => object1.symbol === object2.symbol && object1.chain === object2.chain));
}
const updateEvmAssets = async () => {
    try {
        const users = await models_1.userModel.find({}).lean();
        for (const user of users) {
            const walletAddress = user.keyIdentifier;
            const assets = await models_2.dexAssetModel
                .find({
                keyIdentifier: walletAddress,
                $and: [{ chain: { $ne: index_1.default.Chain.POLKADOT } }, { chain: { $ne: index_1.default.Chain.SOLANA } }],
            })
                .lean();
            const arbiAssets = await arbitrum_1.default.getTokenBalances(walletAddress);
            // stop 2 seconds for api rate limit
            await index_2.default.sleep(2000);
            const avaAssets = await avalanche_1.default.getTokenBalances(walletAddress);
            await index_2.default.sleep(2000);
            const ethAssets = await ethereum_1.default.getTokenBalances(walletAddress);
            await index_2.default.sleep(2000);
            const optiAssets = await optimism_1.default.getTokenBalances(walletAddress);
            await index_2.default.sleep(2000);
            const polygonAssets = await polygon_1.default.getTokenBalances(walletAddress);
            await index_2.default.sleep(2000);
            const bscAssets = await smartchain_1.default.getTokenBalances(walletAddress);
            const evmAssets = [...arbiAssets, ...avaAssets, ...ethAssets, ...optiAssets, ...polygonAssets, ...bscAssets];
            // Remove assets that are not owned anymore
            const existingAssets = evmAssets.map((evmAsset) => ({
                symbol: evmAsset.symbol,
                chain: evmAsset.chain,
            }));
            const oldAssets = assets.map((evmAsset) => ({
                symbol: evmAsset.symbol,
                chain: evmAsset.chain,
            }));
            const assetsThatAreNotOwnedAnymore = [
                ...getDifference(oldAssets, existingAssets),
                ...getDifference(existingAssets, oldAssets),
            ];
            for (const asset of assetsThatAreNotOwnedAnymore) {
                await models_2.dexAssetModel.deleteOne({ keyIdentifier: walletAddress, symbol: asset.symbol, chain: asset.chain });
            }
            // Update assets that is owned at this time
            for (const evmAsset of evmAssets) {
                await models_2.dexAssetModel.findOneAndUpdate({ keyIdentifier: walletAddress, symbol: evmAsset.symbol, chain: evmAsset.chain }, {
                    balance: evmAsset.balance,
                    price: evmAsset.price,
                    value: evmAsset.value,
                    scan: evmAsset.scan,
                    contractAddress: evmAsset.contractAddress,
                });
            }
            // update last asset update date
            await models_1.userModel.findOneAndUpdate({ keyIdentifier: walletAddress }, { lastAssetUpdate: new Date() });
        }
    }
    catch (e) {
        index_2.default.logError({
            func: updateEvmAssets.name,
            path,
            e,
        });
        throw e;
    }
};
const functions = {
    updateEvmAssets,
};
exports.default = functions;
