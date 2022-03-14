const express = require("express");
const router = express.Router();

const { addEvmWallets } = require("./services");

router.post("/add", async (req, res) => {
  const keyIdentifier = req.keyIdentifier;
  const wallets = req.body?.wallets;
  try {
    await addEvmWallets({ keyIdentifier, wallets });
    return res.status(200).send("success");
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = router;
