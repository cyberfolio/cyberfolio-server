const express = require("express");
const { getTokenBalancesFromCovalent } = require("../avalanche/services");
const eth = require("../ethereum/services");
const arbitrum = require("../arbitrum/services");
const router = express.Router();

const { getWallet } = require("../wallets/repository");

router.get("/", async (req, res) => {
  const keyIdentifier = req.keyIdentifier;
  let chain = req.query?.chain;
  let chainToQuery = "";
  if (chain === "Ethereum" || chain === "Avalanche" || chain === "Arbitrum") {
    chainToQuery = "Evm";
  }
  try {
    const wallet = await getWallet({ keyIdentifier, chain: chainToQuery });
    if (!wallet) {
      return [];
    }

    if (chain === "Ethereum") {
      let ethereumTokens = await eth.getTokenBalancesFromCovalent(
        wallet.walletAddress
      );
      const ethTokens = ethereumTokens.map((ethToken) => {
        return { ...ethToken, chain: "Ethereum" };
      });
      return res.status(200).send(ethTokens);
    }

    if (chain === "Avalanche") {
      let avalancheTokens = await getTokenBalancesFromCovalent(
        wallet.walletAddress
      );

      const lancheTokens = avalancheTokens.map((avalancheToken) => {
        return { ...avalancheToken, chain: "Avalanche" };
      });
      return res.status(200).send(lancheTokens);
    }

    if (chain === "Arbitrum") {
      let arbitrumTokens = await arbitrum.getTokenBalancesFromCovalent(
        wallet.walletAddress
      );
      const arbTokens = arbitrumTokens.map((avalancheToken) => {
        return { ...avalancheToken, chain: "Arbitrum" };
      });
      return res.status(200).send(arbTokens);
    }

    return res.status(200).send([]);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = router;
