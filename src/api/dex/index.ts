import { AuthenticatedRequest, Chain } from '@config/types';
import AppUtils from '@utils/index';
import express from 'express';
import DexService from './services';

const DexApi = express.Router();
export interface AddWalletBody {
  address: string;
  name: string;
  chain: Chain;
}

DexApi.post('/add', async (req: AuthenticatedRequest, res: express.Response) => {
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

DexApi.post('/delete', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    // Validation
    const keyIdentifier = req.user?.keyIdentifier;
    const { chain, address } = req.body;
    if (!keyIdentifier) {
      return res.status(400).send('Validation error');
    }
    // Logic
    await DexService.deleteWallet({ keyIdentifier, chain, address });
    await DexService.deleteAssets({ keyIdentifier, address });
    return res.status(200).send('success');
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send(e.message);
    }
    return res.status(500).send('Unexpected error');
  }
});

DexApi.get('/assets/:chain', async (req: AuthenticatedRequest, res: express.Response) => {
  // Validation
  const keyIdentifier = req.user?.keyIdentifier;
  const { chain } = req.params;
  if (!keyIdentifier || !AppUtils.isEnumOf(Chain, chain)) {
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

DexApi.get('/assets', async (req: AuthenticatedRequest, res: express.Response) => {
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

export default DexApi;
