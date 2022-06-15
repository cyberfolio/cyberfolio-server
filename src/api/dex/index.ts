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
    if (e instanceof Error) {
      return res.status(500).send(e.message)
    } else {
      return res.status(500).send('Unexpected error')
    }
  }
})

router.get('/assets/:platform', async (req: any, res: express.Response) => {
  const keyIdentifier = req.keyIdentifier
  const platform = req.params.platform
  try {
    const assets = await getAssets({ keyIdentifier, platform })
    let totalTokenValue = 0
    if (assets) {
      totalTokenValue = assets.reduce(function (acc: any, obj: any) {
        return acc + obj.value
      }, 0)
    }
    return res.status(200).send({ assets, totalTokenValue })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send(e.message)
    } else {
      return res.status(500).send('Unexpected error')
    }
  }
})

export default router
