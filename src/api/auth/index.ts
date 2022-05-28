import express from 'express'
import { ethers } from 'ethers'

import { generateNonce } from '@src/utils'
import { signJwt } from '@config/jwt'
import { authenticateUser } from '@config/middleware'

import {
  createUser,
  updateNonce,
  getUserByEvmAddress,
  getUserByEvmAddressAndNonce,
} from './repository'
import { saveAssets } from '../dex/services'

const router = express.Router()

router.post('/login/metamask', async (req, res, next) => {
  let evmAddress = req.body?.evmAddress as string
  evmAddress = evmAddress.toLowerCase()
  try {
    const nonce = generateNonce()
    const user = await getUserByEvmAddress({ evmAddress })
    if (!user) {
      const newUser = {
        keyIdentifier: evmAddress,
        nonce,
      }
      await createUser(newUser)
    } else {
      await updateNonce({
        nonce,
        evmAddress,
      })
    }
    res.status(200).json({ nonce })
  } catch (e) {
    next(e)
  }
})

router.post('/login/validateSignature', async (req, res, next) => {
  let evmAddress = req.body.evmAddress
  const signature = req.body.signature
  const nonce = req.body.nonce
  evmAddress = evmAddress.toLowerCase()
  try {
    const signerAddress = ethers.utils.verifyMessage(nonce, signature)
    if (signerAddress.toLocaleLowerCase() !== evmAddress) {
      throw new Error('Signature validation failed')
    }
    const user = await getUserByEvmAddressAndNonce({ evmAddress, nonce })
    if (!user) {
      throw new Error('User not found')
    }

    // set jwt to the user's browser cookies
    const token = signJwt(user)
    res.cookie('token', token, {
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: true,
      maxAge: 168 * 60 * 60 * 1000, // 7 days
    })
    const keyIdentifier = user.keyIdentifier

    await saveAssets({ keyIdentifier, chain: 'eth', walletName: 'main' })

    res.status(200).json({ keyIdentifier })
  } catch (e) {
    next(e)
  }
})

router.get('/isAuthenticated', authenticateUser, (req: any, res) => {
  if (req?.keyIdentifier) {
    res.status(200).send({ keyIdentifier: req.keyIdentifier })
  } else {
    res.status(401).send('nein')
  }
})

router.get('/logout', authenticateUser, (req, res) => {
  res.clearCookie('token')
  res.status(403).send('')
})

export default router
