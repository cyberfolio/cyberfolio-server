const express = require("express");
const crypto = require("crypto-js");
const router = express.Router();
const axios = require("axios");

const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_API_SECRET;
const API_URL = process.env.BINANCE_API_URL;

router.get("/", async (req, res) => {
  const queryString = `type=SPOT&timestamp=${Date.now()}&limit=1`;
  const signature = crypto
    .HmacSHA256(queryString, API_SECRET)
    .toString(crypto.enc.Hex);
  try {
    const response = await axios({
      url: `${API_URL}/sapi/v1/accountSnapshot?${queryString}&signature=${signature}`,
      method: "get",
      headers: {
        "X-MBX-APIKEY": API_KEY,
      },
    });

    let data = response.data;
    let latestSnapshotIndex = 0;
    if(data?.snapshotVos?.length) {
      latestSnapshotIndex = data.snapshotVos.length - 1
    }
    if (data?.snapshotVos[latestSnapshotIndex]?.data?.balances?.length > 0) {
      const assetsBiggerThanZero = data?.snapshotVos[latestSnapshotIndex]?.data?.balances?.filter(asset => 
        asset.free > 0
      );
      data = assetsBiggerThanZero;
    }
    res.json(data);

  } catch (error) {
    console.log(error.message);
    throw new Error(error.message)
  }
});

module.exports = router;
