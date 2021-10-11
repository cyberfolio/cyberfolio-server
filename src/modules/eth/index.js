const express = require("express");
const router = express.Router();

const { getEthBalance } = require("./services");

router.get("/total-balance", async (req, res, next) => {
  const walletAddress = req?.query?.address;
  try {
    const balance = await getEthBalance(walletAddress);
    res.send(balance)
  } catch (e) {
    console.log('error firlatildi uzaya cikti')
    next(e);
  }
});

module.exports = router;
