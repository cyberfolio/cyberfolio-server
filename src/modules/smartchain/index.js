const express = require("express");
const router = express.Router();

const { getBEP20Balances } = require("./services");

router.get("/bep20-balance", async (req, res, next) => {
  const walletAddress = req?.query?.address;

  try {
    const balances = await getBEP20Balances(walletAddress);
    res.send(balances);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
