const express = require("express");
const router = express.Router();

const { getTokenBalances } = require("./services");

router.get("/token-balances", async (req, res, next) => {
  const walletAddress = req?.query?.address;

  try {
    const balances = await getTokenBalances(walletAddress);
    res.send(balances);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
