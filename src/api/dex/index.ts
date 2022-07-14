import { AuthenticatedRequest, Chain } from '@config/types';
import { isEnumOf } from '@src/utils';
import express from 'express';

import DexService from './services';

const router = express.Router();
export interface AddWalletBody {
  address: string;
  name: string;
  chain: Chain;
}

router.post('/add', async (req: AuthenticatedRequest, res: express.Response) => {
  // Validation
  try {
    const keyIdentifier = req.user?.keyIdentifier;
    const wallets = req.body?.wallets as AddWalletBody[];
    const walletAddresses = wallets.map((wallet) => wallet.address);
    if (!keyIdentifier || walletAddresses.includes(keyIdentifier)) {
      return res.status(400).send('Validation error');
    }

    // Logic
    await DexService.addWallets({ keyIdentifier, wallets });
    return res.status(200).send('success');
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send(e.message);
    }
    return res.status(500).send('Unexpected error');
  }
});

router.get('/assets/:chain', async (req: AuthenticatedRequest, res: express.Response) => {
  // Validation
  const keyIdentifier = req.user?.keyIdentifier;
  const { chain } = req.params;
  if (!keyIdentifier || !isEnumOf(Chain, chain)) {
    return res.status(400).send('Validation error');
  }

  // Logic
  try {
    const assets = await DexService.getAssets({ keyIdentifier, chain });
    let totalTokenValue = 0;
    if (assets) {
      totalTokenValue = assets.reduce((acc, obj) => acc + obj.value, 0);
    }
    return res.status(200).send({ assets, totalTokenValue });
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send(e.message);
    }
    return res.status(500).send('Unexpected error');
  }
});

router.get('/assets', async (req: AuthenticatedRequest, res: express.Response) => {
  // Validation
  const keyIdentifier = req.user?.keyIdentifier;
  if (!keyIdentifier) {
    return res.status(400).send('Validation error');
  }

  // Logic
  try {
    const assets = await DexService.getAllAssets({ keyIdentifier });
    let totalTokenValue = 0;
    if (assets) {
      totalTokenValue = assets.reduce((acc, obj) => acc + obj.value, 0);
    }
    return res.status(200).send({ assets, totalTokenValue });
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send(e.message);
    }
    return res.status(500).send('Unexpected error');
  }
});

export default router;
