import { logError } from '@src/utils'
import { ethers } from 'ethers'
import { userModel } from './repository/models'

export const checkENSName = async (keyIdentifier: string) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(`${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`)
    const ensName = await provider.lookupAddress(keyIdentifier)
    if (ensName) {
      await userModel.findOneAndUpdate({ keyIdentifier }, { ensName })
    }
  } catch (e) {
    logError({ path: 'src/api/auth/services.ts', func: checkENSName.name, e })
  }
}
