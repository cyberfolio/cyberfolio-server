"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ethers_1 = require("ethers");
const utils_1 = __importDefault(require("@src/utils"));
const services_1 = __importDefault(require("@api/dex/services"));
const index_1 = __importDefault(require("@structures/index"));
const index_2 = __importDefault(require("@config/index"));
const repository_1 = require("./repository");
const services_2 = __importDefault(require("./services"));
const AuthApi = express_1.default.Router();
AuthApi.post('/login/metamask', async (req, res, next) => {
    let evmAddress = req.body?.evmAddress;
    evmAddress = evmAddress.toLowerCase();
    try {
        const nonce = utils_1.default.generateNonce();
        const user = await (0, repository_1.getUserByEvmAddress)({
            evmAddress,
        });
        if (!user) {
            await (0, repository_1.createUser)({
                keyIdentifier: evmAddress,
                nonce,
            });
        }
        else {
            await (0, repository_1.updateNonce)({
                nonce,
                evmAddress,
            });
        }
        res.status(200).send(nonce);
    }
    catch (e) {
        next(e);
    }
});
AuthApi.post('/login/validate-signature', async (req, res, next) => {
    let { evmAddress } = req.body;
    const { signature } = req.body;
    const { nonce } = req.body;
    evmAddress = evmAddress.toLowerCase();
    try {
        const signerAddress = ethers_1.ethers.verifyMessage(nonce, signature);
        if (signerAddress.toLocaleLowerCase() !== evmAddress) {
            throw new Error('Signature validation failed');
        }
        const user = await (0, repository_1.getUserByEvmAddressAndNonce)({
            evmAddress,
            nonce,
        });
        if (!user) {
            throw new Error('User not found');
        }
        const { keyIdentifier } = user;
        if (!user.lastAssetUpdate) {
            await services_1.default.saveAssets({
                keyIdentifier,
                walletAddress: keyIdentifier,
                chain: index_1.default.Chain.ETHEREUM,
                walletName: 'main',
            });
        }
        // set jwt to the user's browser cookies
        const token = index_2.default.Jwt.signJwt(user.keyIdentifier);
        const jwtExpiryInDays = Number(process.env.JWT_EXPIRY_IN_DAYS);
        res.cookie('token', token, {
            secure: process.env.NODE_ENV !== 'development',
            httpOnly: true,
            maxAge: jwtExpiryInDays * 24 * 60 * 60 * 1000,
        });
        const ensName = await services_2.default.checkENSName(evmAddress);
        const response = {
            keyIdentifier,
            ensName,
            lastAssetUpdate: '',
        };
        const verifiedUser = await (0, repository_1.getUserByEvmAddressAndNonce)({
            evmAddress,
            nonce,
        });
        if (verifiedUser?.lastAssetUpdate) {
            response.lastAssetUpdate = verifiedUser.lastAssetUpdate;
        }
        else {
            response.lastAssetUpdate = new Date().toString();
        }
        res.json(response);
    }
    catch (e) {
        next(e);
    }
});
AuthApi.get('/get-user-info', index_2.default.MiddleWare.authenticateUser, async (req, res) => {
    if (req.user) {
        res.status(200).send({
            keyIdentifier: req.user.keyIdentifier,
            ensName: req.user.ensName,
            lastAssetUpdate: req.user.lastAssetUpdate,
        });
    }
    else {
        res.status(401).send('Unauthenticated');
    }
});
AuthApi.get('/logout', index_2.default.MiddleWare.authenticateUser, (req, res) => {
    res.clearCookie('token');
    res.status(403).send('');
});
exports.default = AuthApi;
