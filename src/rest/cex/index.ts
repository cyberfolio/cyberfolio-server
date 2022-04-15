import express from "express";
const router = express.Router();

import { addCex, getSpotAssets } from "./services";

router.post("/add", async (req: any, res: express.Response) => {
  const keyIdentifier = req.keyIdentifier;
  const apiKey = req.body?.apiKey;
  const apiSecret = req.body?.apiSecret;
  const cexName = req.body?.cexName?.toLowerCase();
  const passphrase = req.body?.passphrase;

  try {
    const assets = await addCex({
      keyIdentifier,
      apiKey,
      apiSecret,
      cexName,
      passphrase,
    });
    return res.status(200).send({ assets });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.get("/assets/:cexName", async (req: any, res: express.Response) => {
  const keyIdentifier = req.keyIdentifier;
  const cexName = req.params?.cexName;
  try {
    const assets = await getSpotAssets({
      keyIdentifier,
      cexName,
    });
    return res.status(200).send({ assets });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

export default router;
