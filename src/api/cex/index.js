const express = require("express");
const router = express.Router();

const { addCex } = require("./services");

router.post("/add", async (req, res) => {
  const keyIdentifier = req.keyIdentifier;
  const apiKey = req.body?.apiKey;
  const apiSecret = req.body?.apiSecret;
  const cexName = req.body?.cexName;
  try {
    await addCex({ keyIdentifier, apiKey, apiSecret, cexName });
    return res.status(200).send("success");
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = router;
