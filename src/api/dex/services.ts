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

export const addWallets = async ({
  keyIdentifier,
  wallets,
}: {
  keyIdentifier: string;
  wallets: [{ address: string; name: string; chain: Chain }];
}) => {
  for (const wallet of wallets) {
    const walletAddress = wallet.address;
    const walletName = wallet.name;
    const chain = wallet.chain;
    try {
      const doesExists = await repository.getWalletByName({
        keyIdentifier,
        walletName,
      });
      if (doesExists) {
        throw new Error(`You already have a wallet named ${walletName}`);
      }
      await repository.addWalletByKeyIdentifier({
        keyIdentifier,
        walletAddress,
        walletName,
        chain,
      });
      saveAssets({ keyIdentifier, chain, walletName, walletAddress });
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
