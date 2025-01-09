"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNonce = exports.getUserByEvmAddressAndNonce = exports.getUserByEvmAddress = exports.createUser = void 0;
const utils_1 = __importDefault(require("@src/utils"));
const models_1 = require("./models");
const createUser = async ({ keyIdentifier, nonce }) => {
    try {
        await models_1.userModel.create({ keyIdentifier, nonce });
    }
    catch (e) {
        const error = utils_1.default.onError(e);
        throw error;
    }
};
exports.createUser = createUser;
const getUserByEvmAddress = async ({ evmAddress }) => {
    try {
        const user = await models_1.userModel.findOne({ keyIdentifier: evmAddress }).lean();
        return user;
    }
    catch (e) {
        const error = utils_1.default.onError(e);
        throw error;
    }
};
exports.getUserByEvmAddress = getUserByEvmAddress;
const getUserByEvmAddressAndNonce = async ({ evmAddress, nonce }) => {
    try {
        const user = await models_1.userModel.findOne({ keyIdentifier: evmAddress, nonce });
        return user;
    }
    catch (e) {
        const error = utils_1.default.onError(e);
        throw error;
    }
};
exports.getUserByEvmAddressAndNonce = getUserByEvmAddressAndNonce;
const updateNonce = async ({ evmAddress, nonce }) => {
    try {
        const user = await models_1.userModel.findOneAndUpdate({ keyIdentifier: evmAddress }, { nonce }).lean().exec();
        return user;
    }
    catch (e) {
        const error = utils_1.default.onError(e);
        throw error;
    }
};
exports.updateNonce = updateNonce;
