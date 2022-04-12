const avalanche = require("../../modules/chains/avalanche/services");
const eth = require("../../modules/chains/ethereum/services");
const arbitrum = require("../../modules/chains/arbitrum/services");
const polygon = require("../../modules/chains/polygon/services");
const smartchain = require("../../modules/chains/smartchain/services");
const scamTokens = require("../../config/scamTokenList");

const repository = require("./repository");
const { getBitcoinBalance } = require("../../modules/chains/bitcoin/services");

const addWallets = async ({ keyIdentifier, wallets }) => {
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
      saveAssets({ keyIdentifier, chain, walletName });
    } catch (e) {
      throw new Error(e.message);
    }
  }
};

const getAssets = async ({ keyIdentifier, chain }) => {
  try {
    const assets = await repository.getAssets({ keyIdentifier, chain });
    return assets;
  } catch (e) {
    throw new Error(e);
  }
};

const saveAssets = async ({ keyIdentifier, chain, walletName }) => {
  if (chain === "Evm") {
    try {
      const ethereumTokens = await eth.getTokenBalances(keyIdentifier);
      const avalancheTokens = await avalanche.getTokenBalances(keyIdentifier);
      const arbitrumTokens = await arbitrum.getTokenBalances(keyIdentifier);
      const polygonTokens = await polygon.getTokenBalances(keyIdentifier);
      const smartChaintokens = await smartchain.getTokenBalances(keyIdentifier);

      let allEvmTokens = [
        ...ethereumTokens,
        ...avalancheTokens,
        ...arbitrumTokens,
        ...polygonTokens,
        ...smartChaintokens,
      ];

      if (Array.isArray(allEvmTokens) && allEvmTokens.length > 0) {
        try {
          for (let i = 0; i < allEvmTokens.length; i++) {
            const isScamToken =
              scamTokens.filter((scamToken) => {
                return (
                  scamToken.chain === allEvmTokens[i].chain &&
                  scamToken.contractAddress === allEvmTokens[i].contractAddress
                );
              }).length > 0;
            if (!isScamToken && allEvmTokens[i].value >= 1) {
              await repository.addAssets({
                name: allEvmTokens[i].name,
                symbol: allEvmTokens[i].symbol,
                balance: allEvmTokens[i].balance,
                contractAddress: allEvmTokens[i].contractAddress,
                price: allEvmTokens[i].price,
                value: allEvmTokens[i].value,
                chain: allEvmTokens[i].chain,
                walletName,
                keyIdentifier,
              });
            }
          }
        } catch (e) {
          throw new Error(e.message);
        }
      }
      return allEvmTokens;
    } catch (e) {
      throw new Error(e);
    }
  }
  if (chain === "bitcoin") {
    let bitcoin = await getBitcoinBalance(keyIdentifier);
    try {
      await repository.addAssets({
        name: bitcoin.name,
        symbol: bitcoin.symbol?.toLowerCase(),
        balance: bitcoin.balance,
        price: bitcoin.price,
        value: bitcoin.value,
        walletName,
        keyIdentifier,
      });
      return [bitcoin];
    } catch (e) {
      throw new Error(e);
    }
  }
};

module.exports = {
  addWallets,
  getAssets,
};
