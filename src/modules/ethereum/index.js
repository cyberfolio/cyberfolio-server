const express = require("express");
const router = express.Router();

const { getERC20Balances } = require("./services");

router.get("/erc20-balance", async (req, res, next) => {
  const walletAddress = req?.query?.address;
  try {
    const balance = await getERC20Balances(walletAddress);
    res.send(balance);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
