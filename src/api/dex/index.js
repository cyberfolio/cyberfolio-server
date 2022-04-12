const express = require("express");
const router = express.Router();

const { addWallets, getAssets } = require("./services");

router.post("/add", async (req, res) => {
  const keyIdentifier = req.keyIdentifier;
  const wallets = req.body?.wallets;
  try {
    await addWallets({ keyIdentifier, wallets });
    return res.status(200).send("success");
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.get("/assets/:chain", async (req, res) => {
  const keyIdentifier = req.keyIdentifier;
  let chain = req.params.chain.toLowerCase();
  try {
    const assets = await getAssets({ keyIdentifier, chain });
    return res.status(200).send({ assets });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = router;
