const express = require("express");
const router = express.Router();

const { getAssets, getHoldingsMargin } = require("./services");

router.get("/spot", async (req, res, next) => {
  try {
    const data = await getAssets();
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get("/margin", async (req, res, next) => {
  try {
    const data = await getHoldingsMargin();
    res.json(data);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
