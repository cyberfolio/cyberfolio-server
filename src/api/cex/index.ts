import { AuthenticatedRequest, CexName } from '@config/types';
import AppUtils from '@utils/index';
import express from 'express';

import CexService from './services';

const CexApi = express.Router();

CexApi.post('/add', async (req: AuthenticatedRequest, res: express.Response) => {
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

CexApi.get('/assets', async (req: AuthenticatedRequest, res: express.Response) => {
  const keyIdentifier = req.user?.keyIdentifier;
  if (!keyIdentifier) {
    return res.status(400).send('Validation error');
  }

  try {
    const assets = await CexService.getAssets({
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

CexApi.get('/assets/:cexName', async (req: AuthenticatedRequest, res: express.Response) => {
  const keyIdentifier = req.user?.keyIdentifier;
  const cexName = req.params?.cexName;
  if (!keyIdentifier || !cexName) {
    return res.status(400).send('Validation error');
  }
  if (!AppUtils.isEnumOf(CexName, cexName)) {
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

CexApi.post('/delete', async (req: AuthenticatedRequest, res: express.Response) => {
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

CexApi.get('/payment-history', async (req: AuthenticatedRequest, res: express.Response) => {
  const keyIdentifier = req.user?.keyIdentifier;
  if (!keyIdentifier) {
    return res.status(400).send('Validation error');
  }
  try {
    const paymentHistory = await CexService.getPaymentHistory({
      keyIdentifier,
    });
    return res.status(200).send(paymentHistory);
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send(e.message);
    }
    return res.status(500).send('Unexpected error');
  }
});

export default CexApi;
