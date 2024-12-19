"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@src/utils");
const ethers_1 = require("ethers");
const models_1 = require("./repository/models");
const path = (0, utils_1.getFilePath)(__filename);
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
        (0, utils_1.logError)({
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
