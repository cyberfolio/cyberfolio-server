"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("@src/utils"));
const ethers_1 = require("ethers");
const models_1 = require("./repository/models");
const path = utils_1.default.getFilePath(__filename);
const checkENSName = async (keyIdentifier) => {
    try {
        const provider = new ethers_1.ethers.JsonRpcProvider(`${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`);
        const ensName = await provider.lookupAddress(keyIdentifier);
        if (ensName) {
            await models_1.userModel.findOneAndUpdate({
                keyIdentifier,
            }, {
                ensName,
            });
        }
        return ensName;
    }
    catch (e) {
        utils_1.default.logError({
            path,
            func: checkENSName.name,
            e,
        });
        return '';
    }
};
const AuthService = {
    checkENSName,
};
exports.default = AuthService;
