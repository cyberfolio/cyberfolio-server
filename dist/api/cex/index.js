"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@config/types");
const utils_1 = __importDefault(require("@src/utils"));
const express_1 = __importDefault(require("express"));
const services_1 = __importDefault(require("./services"));
const router = express_1.default.Router();
router.post('/add', async (req, res) => {
    const keyIdentifier = req.user?.keyIdentifier;
    const { apiKey } = req.body;
    const { apiSecret } = req.body;
    const { cexName } = req.body;
    const { passphrase } = req.body;
    if (!keyIdentifier) {
        return res.status(400).send('Validation error');
    }
    try {
        await services_1.default.add({
            keyIdentifier,
            apiKey,
            apiSecret,
            cexName,
            passphrase,
        });
        return res.status(200).send();
    }
    catch (e) {
        if (e instanceof Error) {
            return res.status(500).send(e.message);
        }
        return res.status(500).send('Unexpected error');
    }
});
router.get('/assets', async (req, res) => {
    const keyIdentifier = req.user?.keyIdentifier;
    if (!keyIdentifier) {
        return res.status(400).send('Validation error');
    }
    try {
        const assets = await services_1.default.getAssets({
            keyIdentifier,
        });
        return res.status(200).send({ assets });
    }
    catch (e) {
        if (e instanceof Error) {
            return res.status(500).send(e.message);
        }
        return res.status(500).send('Unexpected error');
    }
});
router.get('/assets/:cexName', async (req, res) => {
    const keyIdentifier = req.user?.keyIdentifier;
    const cexName = req.params?.cexName;
    if (!keyIdentifier || !cexName) {
        return res.status(400).send('Validation error');
    }
    if (!utils_1.default.isEnumOf(types_1.CexName, cexName)) {
        return res.status(400).send('Invalid cex name');
    }
    try {
        const assets = await services_1.default.getSpotAssets({
            keyIdentifier,
            cexName,
        });
        return res.status(200).send({ assets });
    }
    catch (e) {
        if (e instanceof Error) {
            return res.status(500).send(e.message);
        }
        return res.status(500).send('Unexpected error');
    }
});
router.post('/delete', async (req, res) => {
    const keyIdentifier = req.user?.keyIdentifier;
    const { cexName } = req.body;
    if (!keyIdentifier) {
        return res.status(400).send('Validation error');
    }
    try {
        await services_1.default.deleteCex({
            keyIdentifier,
            cexName,
        });
        return res.status(200).send();
    }
    catch (e) {
        if (e instanceof Error) {
            return res.status(500).send(e.message);
        }
        return res.status(500).send('Unexpected error');
    }
});
router.get('/payment-history', async (req, res) => {
    const keyIdentifier = req.user?.keyIdentifier;
    if (!keyIdentifier) {
        return res.status(400).send('Validation error');
    }
    try {
        const paymentHistory = await services_1.default.getPaymentHistory({
            keyIdentifier,
        });
        return res.status(200).send(paymentHistory);
    }
    catch (e) {
        if (e instanceof Error) {
            return res.status(500).send(e.message);
        }
        return res.status(500).send('Unexpected error');
    }
});
exports.default = router;
