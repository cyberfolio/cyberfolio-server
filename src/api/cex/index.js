const express = require("express");
const router = express.Router();

const { addCex, getSpotAssets } = require("./services");

router.post("/add", async (req, res) => {
  const keyIdentifier = req.keyIdentifier;
  const apiKey = req.body?.apiKey;
  const apiSecret = req.body?.apiSecret;
  const cexName = req.body?.cexName;
  try {
    const assets = await addCex({ keyIdentifier, apiKey, apiSecret, cexName });
    return res.status(200).send({ assets });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.get("/assets/:cexName", async (req, res) => {
  const keyIdentifier = req.keyIdentifier;
  const cexName = req.params?.cexName;
  try {
    const assets = await getSpotAssets({
      keyIdentifier,
      cexName,
    });
    console.log(assets);
    return res.status(200).send({ assets });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = router;
