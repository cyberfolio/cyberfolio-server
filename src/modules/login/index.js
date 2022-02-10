const express = require("express");
const { ethers } = require("ethers");
const { generateNonce } = require("../../utils");
const router = express.Router();

const {
  createUser,
  updateNonce,
  getUserByEvmAddress,
  getUserByEvmAddressAndNonce,
} = require("./repository");

router.post("/metamask", async (req, res, next) => {
  let { evmAddress } = req.body;
  evmAddress = evmAddress.toLowerCase();
  try {
    const nonce = generateNonce();
    let user = await getUserByEvmAddress(evmAddress);
    if (!user) {
      user = {
        evmAddress,
        nonce,
      };
      await createUser(user);
    } else {
      user.nonce = nonce;
      await updateNonce(user);
    }
    res.status(200).json({ nonce });
  } catch (e) {
    next(e);
  }
});

router.post("/validateSignature", async (req, res, next) => {
  let { evmAddress, signature, nonce } = req.body;
  evmAddress = evmAddress.toLowerCase();
  try {
    const signerAddress = await ethers.utils.verifyMessage(nonce, signature);
    if (signerAddress.toLocaleLowerCase() !== evmAddress) {
      throw new Error("Signature validation failed");
    }
    const user = await getUserByEvmAddressAndNonce({ evmAddress, nonce });
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json({ user });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
