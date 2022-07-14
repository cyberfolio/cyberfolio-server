import express from 'express';
import { ethers } from 'ethers';

import { generateNonce } from '@src/utils';
import jwtConfig from '@config/jwt';
import { authenticateUser } from '@config/middleware';

import { saveAssets } from '@api/dex/services';
import { AuthenticatedRequest, Chain } from '@config/types';
import { createUser, updateNonce, getUserByEvmAddress, getUserByEvmAddressAndNonce } from './repository';
import AuthService from './services';

const router = express.Router();

router.post('/login/metamask', async (req: express.Request, res: express.Response, next) => {
  let evmAddress = req.body?.evmAddress as string;
  evmAddress = evmAddress.toLowerCase();
  try {
    const nonce = generateNonce();
    const user = await getUserByEvmAddress({
      evmAddress,
    });
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
    }
    res.status(200).send(nonce);
  } catch (e) {
    next(e);
  }
});

router.post('/login/validate-signature', async (req: express.Request, res: express.Response, next) => {
  let { evmAddress } = req.body;
  const { signature } = req.body;
  const { nonce } = req.body;
  evmAddress = evmAddress.toLowerCase();
  try {
    const signerAddress = ethers.utils.verifyMessage(nonce, signature);
    if (signerAddress.toLocaleLowerCase() !== evmAddress) {
      throw new Error('Signature validation failed');
    }
    const user = await getUserByEvmAddressAndNonce({
      evmAddress,
      nonce,
    });
    if (!user) {
      throw new Error('User not found');
    }
    const { keyIdentifier } = user;
    if (!user.lastAssetUpdate) {
      await saveAssets({
        keyIdentifier,
        walletAddress: keyIdentifier,
        chain: Chain.ETHEREUM,
        walletName: 'main',
      });
    }

    // set jwt to the user's browser cookies
    const token = jwtConfig.signJwt(user.keyIdentifier);
    const jwtExpiryInDays = Number(process.env.JWT_EXPIRY_IN_DAYS);
    res.cookie('token', token, {
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: true,
      maxAge: jwtExpiryInDays * 24 * 60 * 60 * 1000,
    });

    const ensName = await AuthService.checkENSName(evmAddress);
    const response = {
      keyIdentifier,
      ensName,
      lastAssetUpdate: '',
    };
    const verifiedUser = await getUserByEvmAddressAndNonce({
      evmAddress,
      nonce,
    });

    if (verifiedUser?.lastAssetUpdate) {
      response.lastAssetUpdate = verifiedUser.lastAssetUpdate;
    } else {
      response.lastAssetUpdate = new Date().toString();
    }
    res.json(response);
  } catch (e) {
    next(e);
  }
});

router.get('/get-user-info', authenticateUser, async (req: AuthenticatedRequest, res: express.Response) => {
  if (req.user) {
    res.status(200).send({
      keyIdentifier: req.user.keyIdentifier,
      ensName: req.user.ensName,
      lastAssetUpdate: req.user.lastAssetUpdate,
    });
  } else {
    res.status(401).send('Unauthenticated');
  }
});

router.get('/logout', authenticateUser, (req, res) => {
  res.clearCookie('token');
  res.status(403).send('');
});

export default router;
