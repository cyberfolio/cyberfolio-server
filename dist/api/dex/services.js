"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("@modules/index"));
const index_2 = __importDefault(require("@utils/index"));
const index_3 = __importDefault(require("@structures/index"));
const models_1 = require("@api/auth/repository/models");
const index_4 = __importDefault(require("@constants/index"));
const repository_1 = __importDefault(require("./repository"));
const models_2 = require("./repository/models");
const getAssets = async ({ keyIdentifier, chain }) => {
    try {
        const assets = await repository_1.default.getAssetsByKeyAndChain({
            keyIdentifier,
            chain,
        });
        return assets;
    }
    catch (e) {
        const error = index_2.default.onError(e);
        throw error;
    }
};
const getAllAssets = async ({ keyIdentifier }) => {
    try {
        const assets = await repository_1.default.getAssets({
            keyIdentifier,
        });
        return assets;
    }
    catch (e) {
        const error = index_2.default.onError(e);
        throw error;
    }
};
const deleteAssets = async ({ keyIdentifier, address }) => {
    try {
        const assets = await models_2.dexAssetModel.deleteMany({
            keyIdentifier,
            walletAddress: address,
        });
        return assets;
    }
    catch (e) {
        const error = index_2.default.onError(e);
        throw error;
    }
};
const saveAssets = async ({ walletAddress, keyIdentifier, chain, walletName, }) => {
    let assets = [];
    if (chain === index_3.default.Chain.ETHEREUM) {
        try {
            const ethereumTokens = await index_1.default.Chain.Ethereum.getTokenBalances(walletAddress);
            const avalancheTokens = await index_1.default.Chain.Avalanche.getTokenBalances(walletAddress);
            const arbitrumTokens = await index_1.default.Chain.Arbitrum.getTokenBalances(walletAddress);
            const optimismTokens = await index_1.default.Chain.Optimism.getTokenBalances(walletAddress);
            const polygonTokens = await index_1.default.Chain.Polygon.getTokenBalances(walletAddress);
            const smartChaintokens = await index_1.default.Chain.SmartChain.getTokenBalances(walletAddress);
            const allEvmTokens = [
                ...ethereumTokens,
                ...avalancheTokens,
                ...arbitrumTokens,
                ...optimismTokens,
                ...polygonTokens,
                ...smartChaintokens,
            ];
            if (Array.isArray(allEvmTokens) && allEvmTokens.length > 0) {
                try {
                    for (const evmAsset of allEvmTokens) {
                        const isScamToken = index_4.default.ScamTokens.find((scamToken) => scamToken.contractAddress.toLowerCase() === evmAsset.contractAddress.toLowerCase() &&
                            scamToken.chain === evmAsset.chain);
                        if (!isScamToken && evmAsset.value >= 1) {
                            await repository_1.default.addAsset({
                                name: evmAsset.name,
                                symbol: evmAsset.symbol,
                                balance: evmAsset.balance,
                                contractAddress: evmAsset.contractAddress,
                                price: evmAsset.price,
                                value: evmAsset.value,
                                chain: evmAsset.chain,
                                scan: evmAsset.scan,
                                walletName,
                                keyIdentifier,
                                walletAddress,
                            });
                        }
                    }
                }
                catch (e) {
                    const error = index_2.default.onError(e);
                    throw error;
                }
            }
            assets = allEvmTokens;
        }
        catch (e) {
            const error = index_2.default.onError(e);
            throw error;
        }
    }
    else if (chain === index_3.default.Chain.BITCOIN) {
        const btcAssets = await index_1.default.Chain.Bitcoin.getBalance(walletAddress);
        try {
            for (const asset of btcAssets) {
                await repository_1.default.addAsset({
                    name: asset.name,
                    symbol: asset.symbol,
                    balance: asset.balance,
                    contractAddress: '',
                    price: asset.price,
                    value: asset.value,
                    chain: asset.chain,
                    scan: asset.scan,
                    walletName,
                    keyIdentifier,
                    walletAddress,
                });
            }
            assets = btcAssets;
        }
        catch (e) {
            const error = index_2.default.onError(e);
            throw error;
        }
    }
    else if (chain === index_3.default.Chain.SOLANA) {
        const solanaAssets = await index_1.default.Chain.Solana.getTokenBalances(walletAddress);
        try {
            for (const asset of solanaAssets) {
                await repository_1.default.addAsset({
                    name: asset.name,
                    symbol: asset.symbol,
                    balance: asset.balance,
                    contractAddress: asset.contractAddress,
                    price: asset.price,
                    value: asset.value,
                    chain: asset.chain,
                    scan: asset.scan,
                    walletName,
                    keyIdentifier,
                    walletAddress,
                });
            }
            assets = solanaAssets;
        }
        catch (e) {
            const error = index_2.default.onError(e);
            throw error;
        }
    }
    await models_1.userModel.findOneAndUpdate({ keyIdentifier: walletAddress }, { lastAssetUpdate: new Date() });
    return assets;
};
const addWallets = async ({ keyIdentifier, wallets }) => {
    for (const wallet of wallets) {
        const walletAddress = wallet.address;
        const walletName = wallet.name;
        const { chain } = wallet;
        try {
            // Validation
            const existingWallets = await repository_1.default.getWallets({
                keyIdentifier,
            });
            const walletNames = existingWallets.map((existingWallet) => existingWallet.walletName);
            const walletAddresses = existingWallets.map((existingWallet) => existingWallet.walletAddress);
            if (walletNames.includes(walletName)) {
                throw new Error(`You already have a wallet named ${walletName}`);
            }
            if (walletAddresses.includes(walletAddress)) {
                throw new Error('You already have this wallet');
            }
            // Execution
            await repository_1.default.addWalletByKeyIdentifier({
                keyIdentifier,
                walletAddress,
                walletName,
                chain,
            });
            await saveAssets({
                keyIdentifier,
                chain,
                walletName,
                walletAddress,
            });
        }
        catch (e) {
            const error = index_2.default.onError(e);
            throw error;
        }
    }
};
const deleteWallet = async ({ keyIdentifier, chain, address, }) => {
    try {
        const assets = await repository_1.default.deleteWallet({
            keyIdentifier,
            address,
            chain,
        });
        return assets;
    }
    catch (e) {
        const error = index_2.default.onError(e);
        throw error;
    }
};
exports.default = {
    addWallets,
    deleteWallet,
    getAssets,
    getAllAssets,
    saveAssets,
    deleteAssets,
};
