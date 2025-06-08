"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("@api/auth/repository");
const jwt_1 = __importDefault(require("./jwt"));
const allowedMethods = (req, res, next) => {
    // NOTE: Exclude TRACE and TRACK methods to avoid XST attacks.
    const allowedMethods = ['OPTIONS', 'HEAD', 'CONNECT', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    if (!allowedMethods.includes(req.method)) {
        return res.status(405).send(`${req.method} not allowed.`);
    }
    next();
};
const authenticateUser = async (req, res, next) => {
    const jwtToken = req.cookies?.token;
    if (!jwtToken) {
        return res.status(401).send('Token could not be found');
    }
    try {
        const jwtPayload = jwt_1.default.verifyJwtAndReturnUserEvmAddress({ jwtToken });
        if (typeof jwtPayload?.evmAddress !== 'string') {
            return res.status(500).send('Unexpected error occured');
        }
        const userInDb = await (0, repository_1.getUserByEvmAddress)({
            evmAddress: jwtPayload.evmAddress,
        });
        req.user = userInDb;
        if (!userInDb) {
            return res.status(401).send('User not found');
        }
        next();
    }
    catch (e) {
        res.clearCookie('token');
        res.status(401).send('Unauthenticated');
    }
};
const MiddleWare = {
    allowedMethods,
    authenticateUser,
};
exports.default = MiddleWare;
