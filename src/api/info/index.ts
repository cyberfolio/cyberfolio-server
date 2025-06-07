import express from 'express';

import { ethers } from 'ethers';
import { AuthenticatedRequest } from '@config/types';
import { getNetWorth, getConnectedAccounts } from './services';

const InfoApi = express.Router();

InfoApi.get('/networth', async (req: AuthenticatedRequest, res: express.Response) => {
  const keyIdentifier = req.user?.keyIdentifier;
  if (!keyIdentifier) {
    return res.status(400).send('Validation error');
  }

  try {
    const netWorth = await getNetWorth({ keyIdentifier });
    return res.status(200).send(netWorth.toString());
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send(e.message);
    }
    return res.status(500).send('Unexpected error');
  }
});

InfoApi.get('/connected-accounts', async (req: AuthenticatedRequest, res: express.Response) => {
  const keyIdentifier = req.user?.keyIdentifier;
  if (!keyIdentifier) {
    return res.status(400).send('Validation error');
  }

  try {
    const connectedAccounts = await getConnectedAccounts({ keyIdentifier });
    return res.status(200).send(connectedAccounts);
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send(e.message);
    }
    return res.status(500).send('Unexpected error');
  }
});

InfoApi.get('/ens-name', async (req: AuthenticatedRequest, res: express.Response) => {
  const keyIdentifier = req.user?.keyIdentifier;
  if (!keyIdentifier) {
    return res.status(400).send('Validation error');
  }

  try {
    const provider = new ethers.JsonRpcProvider(`${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`);
    const ensName = await provider.lookupAddress(keyIdentifier);
    if (ensName) {
      return res.status(200).send(ensName);
    }
    return res.status(200).send('');
  } catch (e) {
    if (e instanceof Error) {
      return res.status(401).send(e.message);
    }
    return res.status(401).send('Unexpected error');
  }
});

export default InfoApi;
