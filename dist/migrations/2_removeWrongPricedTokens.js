"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@api/dex/repository/models");
const logger_1 = __importDefault(require("@config/logger"));
const utils_1 = require("@src/utils");
const models_2 = __importDefault(require("./repository/models"));
const path = (0, utils_1.getFilePath)(__filename);
const Index = async (number) => {
    try {
        const migration = await models_2.default.findOne({});
        if (migration?.number !== undefined && migration?.number < number) {
            logger_1.default.info(`Migration number ${number} started`);
            await models_1.dexAssetModel.deleteMany().or([{ symbol: 'uni-v2' }, { price: { $gte: 200000 } }]);
            await models_2.default.findOneAndUpdate({}, { number });
            logger_1.default.info(`Migration number ${number} finished`);
        }
    }
    catch (e) {
        (0, utils_1.logError)({
            e,
            func: Index.name,
            path,
        });
    }
};
exports.default = Index;
