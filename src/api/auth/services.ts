import { ethers } from 'ethers'
import { userModel } from './repository/models'

export const checkENSName = async (keyIdentifier: string) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      `${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`,
    )
    const ensName = await provider.lookupAddress(keyIdentifier)
    if (ensName) {
      await userModel.findOneAndUpdate({ keyIdentifier }, { ensName })
    }
  } catch (e) {
    console.log(`Error at ${checkENSName.name} src/api/auth/services.ts`)
  }
}
