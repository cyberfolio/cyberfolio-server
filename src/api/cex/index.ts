import { AuthenticatedRequest, CexName } from '@config/types';
import { isEnumOf } from '@src/utils';
import express from 'express';

import CexService from './services';

const router = express.Router();

router.post('/add', async (req: AuthenticatedRequest, res: express.Response) => {
  const keyIdentifier = req.user?.keyIdentifier;
  const { apiKey } = req.body;
  const { apiSecret } = req.body;
  const { cexName } = req.body;
  const { passphrase } = req.body;
  if (!keyIdentifier) {
    return res.status(400).send('Validation error');
  }

  try {
    await CexService.add({
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
    }
    return res.status(500).send('Unexpected error');
  }
});

router.get('/assets', async (req: AuthenticatedRequest, res: express.Response) => {
  const keyIdentifier = req.user?.keyIdentifier;
  if (!keyIdentifier) {
    return res.status(400).send('Validation error');
  }

  try {
    const assets = await CexService.getAssetsByKey({
      keyIdentifier,
    });
    return res.status(200).send({ assets });
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send(e.message);
    }
    return res.status(500).send('Unexpected error');
  }
});

router.get('/assets/:cexName', async (req: AuthenticatedRequest, res: express.Response) => {
  const keyIdentifier = req.user?.keyIdentifier;
  const cexName = req.params?.cexName;
  if (!keyIdentifier || !cexName) {
    return res.status(400).send('Validation error');
  }
  if (!isEnumOf(CexName, cexName)) {
    return res.status(400).send('Invalid cex name');
  }

  try {
    const assets = await CexService.getSpotAssets({
      keyIdentifier,
      cexName,
    });
    return res.status(200).send({ assets });
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send(e.message);
    }
    return res.status(500).send('Unexpected error');
  }
});

router.post('/delete', async (req: AuthenticatedRequest, res: express.Response) => {
  const keyIdentifier = req.user?.keyIdentifier;
  const { cexName } = req.body;
  if (!keyIdentifier) {
    return res.status(400).send('Validation error');
  }
  try {
    await CexService.deleteCex({
      keyIdentifier,
      cexName,
    });
    return res.status(200).send();
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send(e.message);
    }
    return res.status(500).send('Unexpected error');
  }
});

export default router;
