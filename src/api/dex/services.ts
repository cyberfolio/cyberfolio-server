import bitcoin from '@dex/bitcoin';
import avalanche from '@dex/avalanche';
import ethereum from '@dex/ethereum';
import arbitrum from '@dex/arbitrum';
import optimism from '@dex/optimism';
import polygon from '@dex/polygon';
import smartchain from '@dex/smartchain';
import solana from '@dex/solana';

import scamTokens from '@config/scamTokens';
import { onError } from '@src/utils';
import { Chain } from '@config/types';
import { userModel } from '@api/auth/repository/models';
import { DexAssetAPIResponse } from '@dex/common/types';
import { AddWalletBody } from '.';
import repository from './repository';
import { dexAssetModel } from './repository/models';

const getAssets = async ({ keyIdentifier, chain }: { keyIdentifier: string; chain: Chain }) => {
  try {
    const assets = await repository.getAssetsByKeyAndChain({
      keyIdentifier,
      chain,
    });
    return assets;
  } catch (e) {
    const error = onError(e);
    throw error;
  }
};

const getAllAssets = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  try {
    const assets = await repository.getAssets({
      keyIdentifier,
    });
    return assets;
  } catch (e) {
    const error = onError(e);
    throw error;
  }
};

const deleteAssets = async ({ keyIdentifier, address }: { keyIdentifier: string; address: string }) => {
  try {
    const assets = await dexAssetModel.deleteMany({
      keyIdentifier,
      walletAddress: address,
    });
    return assets;
  } catch (e) {
    const error = onError(e);
    throw error;
  }
};

const saveAssets = async ({
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
  let assets: DexAssetAPIResponse[] = [];
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
          for (const evmAsset of allEvmTokens) {
            const isScamToken = scamTokens.find(
              (scamToken) =>
                scamToken.contractAddress.toLowerCase() === evmAsset.contractAddress.toLowerCase() &&
                scamToken.chain === evmAsset.chain,
            );
            if (!isScamToken && evmAsset.value >= 1) {
              await repository.addAsset({
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
        } catch (e) {
          const error = onError(e);
          throw error;
        }
      }
      assets = allEvmTokens;
    } catch (e) {
      const error = onError(e);
      throw error;
    }
  } else if (chain === Chain.BITCOIN) {
    const btcAssets = await bitcoin.getBalance(walletAddress);
    try {
      for (const asset of btcAssets) {
        await repository.addAsset({
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
    } catch (e) {
      const error = onError(e);
      throw error;
    }
  } else if (chain === Chain.SOLANA) {
    const solanaAssets = await solana.getTokenBalances(walletAddress);
    try {
      for (const asset of solanaAssets) {
        await repository.addAsset({
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
    } catch (e) {
      const error = onError(e);
      throw error;
    }
  }
  await userModel.findOneAndUpdate({ keyIdentifier: walletAddress }, { lastAssetUpdate: new Date() });
  return assets;
};

const addWallets = async ({ keyIdentifier, wallets }: { keyIdentifier: string; wallets: AddWalletBody[] }) => {
  for (const wallet of wallets) {
    const walletAddress = wallet.address;
    const walletName = wallet.name;
    const { chain } = wallet;
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
        throw new Error('You already have this wallet');
      }

      // Execution
      await repository.addWalletByKeyIdentifier({
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
    } catch (e) {
      const error = onError(e);
      throw error;
    }
  }
};

const deleteWallet = async ({
  keyIdentifier,
  chain,
  address,
}: {
  keyIdentifier: string;
  chain: Chain;
  address: string;
}) => {
  try {
    const assets = await repository.deleteWallet({
      keyIdentifier,
      address,
      chain,
    });
    return assets;
  } catch (e) {
    const error = onError(e);
    throw error;
  }
};

export default {
  addWallets,
  deleteWallet,
  getAssets,
  getAllAssets,
  saveAssets,
  deleteAssets,
};
