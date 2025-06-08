"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@api/cex/repository/models");
const models_2 = require("@api/dex/repository/models");
const types_1 = require("@config/types");
const index_1 = __importDefault(require("@utils/index"));
const index_2 = __importDefault(require("@config/index"));
const models_3 = __importDefault(require("./repository/models"));
const path = index_1.default.getFilePath(__filename);
const Index = async (number) => {
    try {
        const migration = await models_3.default.findOne({});
        if (migration?.number !== undefined && migration?.number < number) {
            index_2.default.Logger.info(`Migration number ${number} started`);
            await models_2.dexAssetModel.updateMany({ platform: 'bitcoin' }, { $set: { platform: types_1.Platform.BITCOIN } });
            await models_2.dexAssetModel.updateMany({ platform: 'ethereum' }, { $set: { platform: types_1.Platform.ETHEREUM } });
            await models_2.dexAssetModel.updateMany({ platform: 'avalanche' }, { $set: { platform: types_1.Platform.AVALANCHE } });
            await models_2.dexAssetModel.updateMany({ platform: 'smartchain' }, { $set: { platform: types_1.Platform.BSC } });
            await models_2.dexAssetModel.updateMany({ platform: 'polkadot' }, { $set: { platform: types_1.Platform.POLKADOT } });
            await models_2.dexAssetModel.updateMany({ platform: 'polygon' }, { $set: { platform: types_1.Platform.POLYGON } });
            await models_2.dexAssetModel.updateMany({ platform: 'arbitrum' }, { $set: { platform: types_1.Platform.ARBITRUM } });
            await models_2.dexAssetModel.updateMany({ platform: 'optimism' }, { $set: { platform: types_1.Platform.OPTIMISM } });
            await models_1.cexAssetModel.updateMany({ cexName: 'binance' }, { $set: { platform: types_1.Platform.BINANCE } });
            await models_1.cexAssetModel.updateMany({ cexName: 'gateio' }, { $set: { platform: types_1.Platform.GATEIO } });
            await models_1.cexAssetModel.updateMany({ cexName: 'kucoin' }, { $set: { platform: types_1.Platform.KUCOIN } });
            await models_3.default.findOneAndUpdate({}, { number });
            index_2.default.Logger.info(`Migration number ${number} finished`);
        }
    }
    catch (e) {
        index_1.default.logError({
            e,
            func: Index.name,
            path,
        });
    }
};
exports.default = Index;
