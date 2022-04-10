const express = require("express");
const router = express.Router();

const { getBitcoinBalance } = require("./services");

router.get("/balance", async (req, res, next) => {
  try {
    const walletAddress = req?.query?.address;
    if (!walletAddress) {
      throw new Error("Please provide btc wallet address");
    }
    const balance = await getBitcoinBalance(walletAddress);
    res.send(balance);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
