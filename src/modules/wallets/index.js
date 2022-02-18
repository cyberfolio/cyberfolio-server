const express = require("express");
const router = express.Router();

const { addEvmWallets } = require("./services");

router.get("/addEvmWallets", async (req, res, next) => {
  const keyIdentifier = req.keyIdentifier;
  const walletAddresses = req.body?.addresses;

  try {
    await addEvmWallets({ keyIdentifier, walletAddresses });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
