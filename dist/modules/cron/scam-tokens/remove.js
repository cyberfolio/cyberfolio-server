"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("@utils/index"));
const repository_1 = __importDefault(require("@src/api/dex/repository"));
const models_1 = require("@src/api/dex/repository/models");
const axios_1 = __importDefault(require("axios"));
const index_2 = __importDefault(require("@constants/index"));
const model_1 = __importDefault(require("./model"));
const path = index_1.default.getFilePath(__filename);
const removeScamTokens = async () => {
    try {
        const assets = await repository_1.default.getAllAssets();
        const scam = await axios_1.default.get('https://raw.githubusercontent.com/dappradar/tokens-blacklist/main/all-tokens.json');
        const scamTokens = scam?.data?.tokens;
        if (Array.isArray(scam.data?.tokens)) {
            scamTokens.forEach(async ({ address, chainId }) => {
                await model_1.default.findOneAndUpdate({
                    $or: [{ address: address.toLowerCase() }, { address }],
                    $and: [
                        {
                            chainId,
                        },
                    ],
                }, {
                    address: address.toLowerCase(),
                    chainId,
                }, { upsert: true });
            });
        }
        for (const asset of assets) {
            const isScamToken = scamTokens.find((scamToken) => scamToken.address.toLowerCase() === asset.contractAddress.toLowerCase() &&
                scamToken.chainId === index_2.default.PlatformNames[asset.chain].evmChainId);
            if (isScamToken) {
                try {
                    await models_1.dexAssetModel.deleteMany({ contractAddress: asset.contractAddress });
                }
                catch (e) {
                    index_1.default.logError({
                        func: removeScamTokens.name,
                        path,
                        e,
                    });
                }
            }
        }
    }
    catch (e) {
        index_1.default.logError({
            func: removeScamTokens.name,
            path,
            e,
        });
        throw e;
    }
};
exports.default = removeScamTokens;
