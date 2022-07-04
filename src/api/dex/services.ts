import bitcoin from "@dex/bitcoin";
import avalanche from "@dex/avalanche";
import ethereum from "@dex/ethereum";
import arbitrum from "@dex/arbitrum";
import optimism from "@dex/optimism";
import polygon from "@dex/polygon";
import smartchain from "@dex/smartchain";

import scamTokens from "@config/scamTokens";
import * as repository from "./repository";
import { onError } from "@src/utils";
import { Chain } from "@config/types";
import { userModel } from "@api/auth/repository/models";
import { AddWalletBody } from ".";

export const addWallets = async ({ keyIdentifier, wallets }: { keyIdentifier: string; wallets: AddWalletBody[] }) => {
  for (const wallet of wallets) {
    const walletAddress = wallet.address;
    const walletName = wallet.name;
    const chain = wallet.chain;
    try {
      // Validation
      const existingWallets = await repository.getWallets({
        keyIdentifier,
      });
      const walletNames = existingWallets.map((existingWallet) => existingWallet.walletName);
      const walletAddresses = existingWallets.map((existingWallet) => existingWallet.walletAddress);
      if (walletNames.includes(walletName)) {
        throw new Error(`You already have a wallet named ${walletName}`);
      }
      if (walletAddresses.includes(walletAddress)) {
        throw new Error(`You already have this wallet`);
      }

      // Execution
      await repository.addWalletByKeyIdentifier({
        keyIdentifier,
        walletAddress,
        walletName,
        chain,
      });
      await saveAssets({ keyIdentifier, chain, walletName, walletAddress });
    } catch (e) {
      onError(e);
    }
  }
};

export const getAssets = async ({ keyIdentifier, chain }: { keyIdentifier: string; chain: Chain }) => {
  try {
    const assets = await repository.getAssetsByKeyAndChain({
      keyIdentifier,
      chain,
    });
    return assets;
  } catch (e) {
    onError(e);
  }
};

export const getAllAssets = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  try {
    const assets = await repository.getAssetsByKey({
      keyIdentifier,
    });
    return assets;
  } catch (e) {
    onError(e);
  }
};

export const saveAssets = async ({
  walletAddress,
  keyIdentifier,
  chain,
  walletName,
}: {
  walletAddress: string;
  keyIdentifier: string;
  chain: Chain;
  walletName: string;
}) => {
  if (chain === Chain.ETHEREUM) {
    try {
      const avalancheTokens = await avalanche.getTokenBalances(walletAddress);
      const arbitrumTokens = await arbitrum.getTokenBalances(walletAddress);
      const optimismTokens = await optimism.getTokenBalances(walletAddress);
      const polygonTokens = await polygon.getTokenBalances(walletAddress);
      const smartChaintokens = await smartchain.getTokenBalances(walletAddress);
      const ethereumTokens = await ethereum.getTokenBalances(walletAddress);

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
          for (let i = 0; i < allEvmTokens.length; i++) {
            const isScamToken = scamTokens.find(
              (scamToken) =>
                scamToken.contractAddress.toLowerCase() === allEvmTokens[i].contractAddress.toLowerCase() &&
                scamToken.chain === allEvmTokens[i].chain,
            );
            if (!isScamToken && allEvmTokens[i].value >= 1) {
              await repository.addAsset({
                name: allEvmTokens[i].name,
                symbol: allEvmTokens[i].symbol,
                balance: allEvmTokens[i].balance,
                contractAddress: allEvmTokens[i].contractAddress,
                price: allEvmTokens[i].price,
                value: allEvmTokens[i].value,
                chain: allEvmTokens[i].chain,
                scan: allEvmTokens[i].scan,
                walletName,
                keyIdentifier,
                walletAddress,
              });
            }
          }
        } catch (e) {
          onError(e);
        }
      }
      return allEvmTokens;
    } catch (e) {
      onError(e);
    }
  } else if (chain === Chain.BITCOIN) {
    const btc = await bitcoin.getBalance(walletAddress);

    const asset = {
      keyIdentifier,
      walletName,
      name: btc.name,
      symbol: btc.symbol.toLowerCase(),
      balance: btc.balance,
      price: btc.price,
      value: btc.value,
      scan: btc.scan,
      chain: Chain.BITCOIN,
      contractAddress: "",
      walletAddress,
    };

    try {
      await repository.addAsset(asset);
      return [bitcoin];
    } catch (e) {
      onError(e);
    }
  }
  await userModel.findOneAndUpdate({ keyIdentifier: walletAddress }, { lastAssetUpdate: new Date() });
};

export default {
  addWallets,
  getAssets,
  getAllAssets,
  saveAssets,
};
