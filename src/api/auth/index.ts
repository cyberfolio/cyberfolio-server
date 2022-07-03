import express from "express";
import { ethers } from "ethers";

import { generateNonce } from "@src/utils";
import { signJwt } from "@config/jwt";
import { authenticateUser } from "@config/middleware";

import {
  createUser,
  updateNonce,
  getUserByEvmAddress,
  getUserByEvmAddressAndNonce,
  updateFirstTimeLogin,
} from "./repository";
import { saveAssets } from "../dex/services";
import { checkENSName } from "./services";
import { Platform } from "@config/types";

const router = express.Router();

router.post("/login/metamask", async (req, res, next) => {
  let evmAddress = req.body?.evmAddress as string;
  evmAddress = evmAddress.toLowerCase();
  try {
    const nonce = generateNonce();
    const user = await getUserByEvmAddress({ evmAddress });
    if (!user) {
      await createUser({
        keyIdentifier: evmAddress,
        nonce,
      });
    } else {
      await updateNonce({
        nonce,
        evmAddress,
      });
      await updateFirstTimeLogin({
        evmAddress,
      });
    }
    res.status(200).send(nonce);
  } catch (e) {
    next(e);
  }
});

router.post("/login/validate-signature", async (req, res, next) => {
  let evmAddress = req.body.evmAddress;
  const signature = req.body.signature;
  const nonce = req.body.nonce;
  evmAddress = evmAddress.toLowerCase();
  try {
    const signerAddress = ethers.utils.verifyMessage(nonce, signature);
    if (signerAddress.toLocaleLowerCase() !== evmAddress) {
      throw new Error("Signature validation failed");
    }
    const user = await getUserByEvmAddressAndNonce({ evmAddress, nonce });
    if (!user) {
      throw new Error("User not found");
    }
    const keyIdentifier = user.keyIdentifier;
    if (user.firstTimeLogin) {
      await saveAssets({
        keyIdentifier,
        walletAddress: keyIdentifier,
        platform: Platform.ETHEREUM,
        walletName: "main",
      });
    } else {
      saveAssets({
        keyIdentifier,
        walletAddress: keyIdentifier,
        platform: Platform.ETHEREUM,
        walletName: "main",
      });
    }

    // set jwt to the user's browser cookies
    const token = signJwt(user);
    const jwtExpiryInDays = Number(process.env.JWT_EXPIRY_IN_DAYS);
    res.cookie("token", token, {
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true,
      maxAge: jwtExpiryInDays * 24 * 60 * 60 * 1000,
    });

    checkENSName(evmAddress);
    const response = {
      keyIdentifier,
      ensName: "",
      lastAssetUpdate: "",
    };
    const verifiedUser = await getUserByEvmAddressAndNonce({
      evmAddress,
      nonce,
    });
    if (verifiedUser?.ensName) {
      response.ensName = verifiedUser.ensName;
    }
    if (verifiedUser?.lastAssetUpdate) {
      response.lastAssetUpdate = verifiedUser.lastAssetUpdate;
    }

    res.json(response);
  } catch (e) {
    next(e);
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.get("/get-user-info", authenticateUser, async (req: any, res) => {
  if (req.keyIdentifier) {
    const verifiedUser = await getUserByEvmAddress({
      evmAddress: req.keyIdentifier,
    });
    res.status(200).send({
      keyIdentifier: req.keyIdentifier,
      ensName: verifiedUser?.ensName,
      lastAssetUpdate: verifiedUser?.lastAssetUpdate,
    });
  } else {
    res.status(401).send("Unauthenticated");
  }
});

router.get("/logout", authenticateUser, (req, res) => {
  res.clearCookie("token");
  res.status(403).send("");
});

export default router;
