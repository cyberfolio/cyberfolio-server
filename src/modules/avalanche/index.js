const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/arc20-balance", async (req, res, next) => {
  const walletAddress = req?.query?.address;

  try {
    const response = await axios({
      url: `${process.env.COVALENT_V1_API_URL}/${process.env.AVALANCE_CCHAIN_ID}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`,
      method: "get",
    });
    res.send(response?.data);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
