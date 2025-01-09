"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("@src/utils"));
const _1_migratePlatfromName_1 = __importDefault(require("./1_migratePlatfromName"));
const _2_removeWrongPricedTokens_1 = __importDefault(require("./2_removeWrongPricedTokens"));
const models_1 = __importDefault(require("./repository/models"));
const path = utils_1.default.getFilePath(__filename);
const Index = async () => {
    try {
        const migration = await models_1.default.findOne({});
        if (!migration) {
            await models_1.default.create({ number: 0 });
        }
        await (0, _1_migratePlatfromName_1.default)(1);
        await (0, _2_removeWrongPricedTokens_1.default)(2);
    }
    catch (e) {
        utils_1.default.logError({
            e,
            func: Index.name,
            path,
        });
    }
};
exports.default = Index;
