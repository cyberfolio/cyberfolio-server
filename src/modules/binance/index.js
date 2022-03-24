const express = require("express");
const router = express.Router();

const {
  getHoldings,
  getFiatDepositAndWithDrawalHistory,
  getFiatPaymentBuyAndSellHistory,
} = require("./services");

router.get("/spot", async (req, res, next) => {
  try {
    const data = await getHoldings();
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get("/fiat-deposit-history", async (req, res, next) => {
  try {
    const data = await getFiatDepositAndWithDrawalHistory(0);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get("/fiat-withdraw-history", async (req, res, next) => {
  try {
    const data = await getFiatDepositAndWithDrawalHistory(1);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get("/fiat-payment-buy-history", async (req, res, next) => {
  try {
    const data = await getFiatPaymentBuyAndSellHistory(1);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get("/fiat-payment-sell-history", async (req, res, next) => {
  try {
    const data = await getFiatPaymentBuyAndSellHistory(1);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
