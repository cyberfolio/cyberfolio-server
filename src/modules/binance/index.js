const express = require("express");
const crypto = require("crypto-js");
const router = express.Router();
const axios = require("axios");

const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_API_SECRET;
const API_URL = process.env.BINANCE_API_URL;


const getHoldings = async (type) => {
  const queryString = `type=${type}&timestamp=${Date.now()}`;
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
    if (data?.snapshotVos?.length) {
      latestSnapshotIndex = data.snapshotVos.length - 1
    }
    console.log(data)
    if (data?.snapshotVos[latestSnapshotIndex]?.data?.balances[0]?.free) {
      const assetsBiggerThanZero = data?.snapshotVos[latestSnapshotIndex]?.data?.balances?.filter(asset =>
        asset.free > 0
      );
      data = assetsBiggerThanZero;
    }
    return data
  } catch (e) {
    if(e?.response?.data?.code) {
      throw new Error(e.response.data.code)
    } else {
      throw new Error(e.message)
    }
  }
}

router.get("/spot", async (req, res, next) => {
  try {
    const data = await getHoldings('SPOT')
    res.json(data);
  }catch (e){
    next(e);
  }
});

router.get("/margin", async (req, res, next) => {
  try {
    const data = await getHoldings('MARGIN')
    res.json(data);
  }catch (e){
    next(e);
  }
});

router.get("/futures", async (req, res, next) => {
  try {
    const data = await getHoldings('FUTURES')
    res.json(data);
  }catch (e){
    next(e);
  }
});

module.exports = router;
