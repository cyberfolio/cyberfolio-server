import express from "express";
const router = express.Router();

import { getNetWorth, getAvailableAccounts } from "./services";
import { ethers } from "ethers";
import { AuthenticatedRequest } from "@config/types";

router.get("/networth", async (req: AuthenticatedRequest, res: express.Response) => {
  const keyIdentifier = req.user?.keyIdentifier;
  if (!keyIdentifier) {
    return res.status(400).send("Validation error");
  }

  try {
    let netWorth = await getNetWorth({ keyIdentifier });
    netWorth = netWorth.toString();
    return res.status(200).send(netWorth);
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send(e.message);
    } else {
      return res.status(500).send("Unexpected error");
    }
  }
});

router.get("/available-accounts", async (req: AuthenticatedRequest, res: express.Response) => {
  const keyIdentifier = req.user?.keyIdentifier;
  if (!keyIdentifier) {
    return res.status(400).send("Validation error");
  }

  try {
    const availableAccounts = await getAvailableAccounts({ keyIdentifier });
    return res.status(200).send(availableAccounts);
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send(e.message);
    } else {
      return res.status(500).send("Unexpected error");
    }
  }
});

router.get("/ens-name", async (req: AuthenticatedRequest, res: express.Response) => {
  const keyIdentifier = req.user?.keyIdentifier;
  if (!keyIdentifier) {
    return res.status(400).send("Validation error");
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(
      `${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`,
    );
    const ensName = await provider.lookupAddress(keyIdentifier);
    if (ensName) {
      return res.status(200).send(ensName);
    } else {
      return res.status(200).send("");
    }
  } catch (e) {
    if (e instanceof Error) {
      return res.status(401).send(e.message);
    } else {
      return res.status(401).send("Unexpected error");
    }
  }
});

export default router;
