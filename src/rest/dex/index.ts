import express from 'express'
const router = express.Router()

import { addWallets, getAssets } from './services'

router.post('/add', async (req: any, res: express.Response) => {
  const keyIdentifier = req.keyIdentifier
  const wallets = req.body?.wallets
  try {
    await addWallets({ keyIdentifier, wallets })
    return res.status(200).send('success')
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.get('/assets/:chain', async (req: any, res: express.Response) => {
  const keyIdentifier = req.keyIdentifier
  const chain = req.params.chain.toLowerCase()
  try {
    const assets = await getAssets({ keyIdentifier, chain })
    const totalTokenValue = assets.reduce(function (acc: any, obj: any) {
      return acc + obj.value
    }, 0)
    return res.status(200).send({ assets, totalTokenValue })
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

export default router
