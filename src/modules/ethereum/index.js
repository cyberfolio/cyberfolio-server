const express = require("express");
const router = express.Router();

const {
  getTokenBalancesFromCovalent,
  getEthBalance,
  isValidEthAddress,
} = require("./services");

router.get("/balance", async (req, res, next) => {
  const walletAddress = req?.query?.address;
  if (!walletAddress) {
    throw new Error("Please provide eth wallet address");
  }
  if (!isValidEthAddress(walletAddress)) {
    throw new Error("Eth address is invalid");
  }
  try {
    const balance = await getTokenBalancesFromCovalent(walletAddress);
    res.send(balance);
  } catch (e) {
    next(e);
  }
});

router.get("/eth-balance", async (req, res, next) => {
  const walletAddress = req?.query?.address;
  if (!walletAddress) {
    throw new Error("Please provide eth wallet address");
  }
  if (!isValidEthAddress(walletAddress)) {
    throw new Error("Eth address is invalid");
  }
  try {
    const balance = await getEthBalance(walletAddress);
    res.send(balance);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
