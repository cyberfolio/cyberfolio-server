"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@config/types");
const utils_1 = require("@src/utils");
const express_1 = __importDefault(require("express"));
const services_1 = __importDefault(require("./services"));
const router = express_1.default.Router();
router.post('/add', async (req, res) => {
    // Validation
    try {
        const keyIdentifier = req.user?.keyIdentifier;
        const wallets = req.body?.wallets;
        const walletAddresses = wallets.map((wallet) => wallet.address);
        if (!keyIdentifier || walletAddresses.includes(keyIdentifier)) {
            return res.status(400).send('Validation error');
        }
        // Logic
        await services_1.default.addWallets({ keyIdentifier, wallets });
        return res.status(200).send('success');
    }
    catch (e) {
        if (e instanceof Error) {
            return res.status(500).send(e.message);
        }
        return res.status(500).send('Unexpected error');
    }
});
router.post('/delete', async (req, res) => {
    try {
        // Validation
        const keyIdentifier = req.user?.keyIdentifier;
        const { chain, address } = req.body;
        if (!keyIdentifier) {
            return res.status(400).send('Validation error');
        }
        // Logic
        await services_1.default.deleteWallet({ keyIdentifier, chain, address });
        await services_1.default.deleteAssets({ keyIdentifier, address });
        return res.status(200).send('success');
    }
    catch (e) {
        if (e instanceof Error) {
            return res.status(500).send(e.message);
        }
        return res.status(500).send('Unexpected error');
    }
});
router.get('/assets/:chain', async (req, res) => {
    // Validation
    const keyIdentifier = req.user?.keyIdentifier;
    const { chain } = req.params;
    if (!keyIdentifier || !(0, utils_1.isEnumOf)(types_1.Chain, chain)) {
        return res.status(400).send('Validation error');
    }
    // Logic
    try {
        const assets = await services_1.default.getAssets({ keyIdentifier, chain });
        let totalTokenValue = 0;
        if (assets) {
            totalTokenValue = assets.reduce((acc, obj) => acc + obj.value, 0);
        }
        return res.status(200).send({ assets, totalTokenValue });
    }
    catch (e) {
        if (e instanceof Error) {
            return res.status(500).send(e.message);
        }
        return res.status(500).send('Unexpected error');
    }
});
router.get('/assets', async (req, res) => {
    // Validation
    const keyIdentifier = req.user?.keyIdentifier;
    if (!keyIdentifier) {
        return res.status(400).send('Validation error');
    }
    // Logic
    try {
        const assets = await services_1.default.getAllAssets({ keyIdentifier });
        let totalTokenValue = 0;
        if (assets) {
            totalTokenValue = assets.reduce((acc, obj) => acc + obj.value, 0);
        }
        return res.status(200).send({ assets, totalTokenValue });
    }
    catch (e) {
        if (e instanceof Error) {
            return res.status(500).send(e.message);
        }
        return res.status(500).send('Unexpected error');
    }
});
exports.default = router;
