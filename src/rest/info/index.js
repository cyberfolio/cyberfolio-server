const express = require("express");
const { getNetWorth } = require("./services");
const router = express.Router();

router.get("/networth", async (req, res) => {
  const keyIdentifier = req.keyIdentifier;
  try {
    const netWorth = await getNetWorth({ keyIdentifier });
    return res.status(200).send({ netWorth });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = router;
