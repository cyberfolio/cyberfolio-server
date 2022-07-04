import { AuthenticatedRequest, CexName } from "@config/types";
import { isEnumOf } from "@src/utils";
import express from "express";
const router = express.Router();

import { addCex, getAllSpot, getSpotAssetsByCexName } from "./services";

router.post("/add", async (req: AuthenticatedRequest, res: express.Response) => {
  const keyIdentifier = req.user?.keyIdentifier;
  const apiKey = req.body.apiKey;
  const apiSecret = req.body.apiSecret;
  const cexName = req.body.cexName;
  const passphrase = req.body.passphrase;
  if (!keyIdentifier) {
    return res.status(400).send("Validation error");
  }

  try {
    await addCex({
      keyIdentifier,
      apiKey,
      apiSecret,
      cexName,
      passphrase,
    });
    return res.status(200).send();
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send(e.message);
    } else {
      return res.status(500).send("Unexpected error");
    }
  }
});

router.get("/assets", async (req: AuthenticatedRequest, res: express.Response) => {
  const keyIdentifier = req.user?.keyIdentifier;
  if (!keyIdentifier) {
    return res.status(400).send("Validation error");
  }

  try {
    const assets = await getAllSpot({
      keyIdentifier,
    });
    return res.status(200).send({ assets });
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send(e.message);
    } else {
      return res.status(500).send("Unexpected error");
    }
  }
});

router.get("/assets/:cexName", async (req: AuthenticatedRequest, res: express.Response) => {
  const keyIdentifier = req.user?.keyIdentifier;
  const cexName = req.params?.cexName;
  if (!keyIdentifier || !cexName) {
    return res.status(400).send("Validation error");
  }
  if (!isEnumOf(CexName, cexName)) {
    return res.status(400).send("Invalid cex name");
  }

  try {
    const assets = await getSpotAssetsByCexName({
      keyIdentifier,
      cexName,
    });
    return res.status(200).send({ assets });
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send(e.message);
    } else {
      return res.status(500).send("Unexpected error");
    }
  }
});

export default router;
