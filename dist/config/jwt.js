"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@src/utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET;
const jwtExpiryInDays = Number(process.env.JWT_EXPIRY_IN_DAYS);
const signJwt = (evmAddress) => {
    if (evmAddress && process.env.JWT_SECRET) {
        const token = jsonwebtoken_1.default.sign({ evmAddress }, secret, {
            expiresIn: `${jwtExpiryInDays}d`,
        });
        return token;
    }
    throw new Error('Please provide user');
};
const verifyJwtAndReturnUserEvmAddress = ({ jwtToken }) => {
    try {
        const result = jsonwebtoken_1.default.verify(jwtToken, secret);
        return result;
    }
    catch (e) {
        const error = (0, utils_1.onError)(e);
        throw error;
    }
};
exports.default = {
    signJwt,
    verifyJwtAndReturnUserEvmAddress,
};
