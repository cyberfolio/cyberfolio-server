"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ethers_1 = require("ethers");
const services_1 = require("./services");
const router = express_1.default.Router();
router.get('/networth', async (req, res) => {
    const keyIdentifier = req.user?.keyIdentifier;
    if (!keyIdentifier) {
        return res.status(400).send('Validation error');
    }
    try {
        const netWorth = await (0, services_1.getNetWorth)({ keyIdentifier });
        return res.status(200).send(netWorth.toString());
    }
    catch (e) {
        if (e instanceof Error) {
            return res.status(500).send(e.message);
        }
        return res.status(500).send('Unexpected error');
    }
});
router.get('/connected-accounts', async (req, res) => {
    const keyIdentifier = req.user?.keyIdentifier;
    if (!keyIdentifier) {
        return res.status(400).send('Validation error');
    }
    try {
        const connectedAccounts = await (0, services_1.getConnectedAccounts)({ keyIdentifier });
        return res.status(200).send(connectedAccounts);
    }
    catch (e) {
        if (e instanceof Error) {
            return res.status(500).send(e.message);
        }
        return res.status(500).send('Unexpected error');
    }
});
router.get('/ens-name', async (req, res) => {
    const keyIdentifier = req.user?.keyIdentifier;
    if (!keyIdentifier) {
        return res.status(400).send('Validation error');
    }
    try {
        const provider = new ethers_1.ethers.JsonRpcProvider(`${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`);
        const ensName = await provider.lookupAddress(keyIdentifier);
        if (ensName) {
            return res.status(200).send(ensName);
        }
        return res.status(200).send('');
    }
    catch (e) {
        if (e instanceof Error) {
            return res.status(401).send(e.message);
        }
        return res.status(401).send('Unexpected error');
    }
});
exports.default = router;
