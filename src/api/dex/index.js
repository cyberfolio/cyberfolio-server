const express = require("express");
const router = express.Router();

const {
  getTokenBalancesFromCovalent,
} = require("../../modules/avalanche/services");
const eth = require("../../modules/ethereum/services");
const arbitrum = require("../../modules/arbitrum/services");
const smartchain = require("../../modules/smartchain/services");
const polygon = require("../../modules/polygon/services");

const { getWallet } = require("../wallets/repository");
const { getBitcoinBalance } = require("../../modules/bitcoin/services");

router.get("/assets/:chain", async (req, res) => {
  const keyIdentifier = req.keyIdentifier;
  let chain = req.params?.chain;
  let chainToQuery = "";
  if (
    chain === "Ethereum" ||
    chain === "Avalanche" ||
    chain === "Arbitrum" ||
    chain === "SmartChain"
  ) {
    chainToQuery = "Evm";
  }
  try {
    const wallet = await getWallet({
      keyIdentifier,
      chain: chainToQuery ? chainToQuery : chain,
    });
    if (!wallet) {
      return res.status(200).send([]);
    }

    if (chain === "Ethereum") {
      try {
        let ethereumTokens = await eth.getTokenBalancesFromCovalent(
          wallet.walletAddress
        );
        const ethTokens = ethereumTokens.map((ethToken) => {
          return {
            ...ethToken,
            chain: "Ethereum",
            walletName: wallet?.walletName,
          };
        });
        return res.status(200).send(ethTokens);
      } catch (e) {
        return res.status(500).send(e.message);
      }
    }

    if (chain === "Avalanche") {
      let avalancheTokens = await getTokenBalancesFromCovalent(
        wallet.walletAddress
      );

      const lancheTokens = avalancheTokens.map((avalancheToken) => {
        return {
          ...avalancheToken,
          chain: "Avalanche",
          walletName: wallet?.walletName,
        };
      });
      return res.status(200).send(lancheTokens);
    }

    if (chain === "Arbitrum") {
      let arbitrumTokens = await arbitrum.getTokenBalancesFromCovalent(
        wallet.walletAddress
      );
      const arbTokens = arbitrumTokens.map((avalancheToken) => {
        return {
          ...avalancheToken,
          chain: "Arbitrum",
          walletName: wallet?.walletName,
        };
      });
      return res.status(200).send(arbTokens);
    }

    if (chain === "Polygon") {
      let tokens = await polygon.getTokenBalancesFromCovalent(
        wallet.walletAddress
      );
      const polyTokens = tokens.map((token) => {
        return { ...token, chain: "Polygon", walletName: wallet?.walletName };
      });
      return res.status(200).send(polyTokens);
    }
    if (chain === "SmartChain") {
      let tokens = await smartchain.getTokenBalancesFromCovalent(
        wallet.walletAddress
      );
      const smartTokens = tokens.map((token) => {
        return {
          ...token,
          chain: "Smart Chain",
          walletName: wallet?.walletName,
        };
      });
      return res.status(200).send(smartTokens);
    }

    if (chain === "Bitcoin") {
      let bitcoin = await getBitcoinBalance(wallet.walletAddress);
      bitcoin.walletName = wallet?.walletName;
      return res.status(200).send([bitcoin]);
    }

    return res.status(200).send([]);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = router;
