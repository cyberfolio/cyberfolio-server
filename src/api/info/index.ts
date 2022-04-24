import express from 'express'
const router = express.Router()

import { getNetWorth, getAvailableAccounts } from './services'

router.get('/networth', async (req: any, res: express.Response) => {
  const keyIdentifier = req.keyIdentifier
  try {
    const netWorth = await getNetWorth({ keyIdentifier })
    return res.status(200).send({ netWorth })
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.get('/available-accounts', async (req: any, res: express.Response) => {
  const keyIdentifier = req.keyIdentifier
  try {
    const availableAccounts = await getAvailableAccounts({ keyIdentifier })
    return res.status(200).send({ availableAccounts })
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

export default router
