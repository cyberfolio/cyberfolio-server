"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import axios from 'axios';
const index_1 = __importDefault(require("@utils/index"));
// import evmAssetsResponse from '@modules/chain/common/evmAssetsResponse';
const index_2 = __importDefault(require("@structures/index"));
// import { CovalentTokenBalanceResponse } from '@modules/chain/common/types';
const index_3 = __importDefault(require("@constants/index"));
const moralis_1 = __importDefault(require("moralis"));
const path = index_1.default.getFilePath(__filename);
const getTokenBalances = async (walletAddress) => {
    await moralis_1.default.start({
        apiKey: process.env.MORALIS_API_KEY,
    });
    try {
        // const walletInfo = await axios.get<CovalentTokenBalanceResponse>(
        //   `${process.env.COVALENT_V1_API_URL}/${AppConstants.ChainIDs.ARBITRUM}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`,
        // );
        // const assets = walletInfo.data.data.items;
        // const response = await evmAssetsResponse(walletAddress, ScanURL.ARBITRUM, assets, Chain.ARBITRUM);
        const tokenBalancesResponse = await moralis_1.default.EvmApi.wallets.getWalletTokenBalancesPrice({
            chain: index_1.default.toHexChainId(index_3.default.ChainIDs.ETHEREUM),
            address: walletAddress,
        });
        const response = tokenBalancesResponse.response.result.map((item) => {
            return {
                name: item.name,
                symbol: item.symbol,
                contractAddress: String(item.tokenAddress?.lowercase),
                logo: item.logo,
                balance: Number(item.balanceFormatted),
                price: Number(item.usdPrice),
                value: item.usdValue,
                chain: index_2.default.Chain.ARBITRUM,
                scan: index_2.default.ScanURL.ARBITRUM,
            };
        });
        return response;
    }
    catch (e) {
        index_1.default.logError({
            e,
            func: getTokenBalances.name,
            path,
        });
        throw e;
    }
};
const Arbitrum = {
    getTokenBalances,
};
exports.default = Arbitrum;
