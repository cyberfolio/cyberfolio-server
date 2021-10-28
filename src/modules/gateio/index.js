const express = require("express");
const router = express.Router();

const { getHoldings } = require("./services");

router.get("/spot", async (req, res, next) => {
  try {
    const data = await getHoldings("spot");
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get("/margin", async (req, res, next) => {
  try {
    const data = await getHoldings("margin");
    res.json(data);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
