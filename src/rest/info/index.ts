import express from "express";
import { getNetWorth } from "./services";
const router = express.Router();

router.get("/networth", async (req: any, res: express.Response) => {
  const keyIdentifier = req.keyIdentifier;
  try {
    const netWorth = await getNetWorth({ keyIdentifier });
    return res.status(200).send({ netWorth });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

export default router;
