import { userModel } from './models'

export const createUser = async ({
  keyIdentifier,
  nonce,
}: {
  keyIdentifier: string
  nonce: string
}) => {
  try {
    await userModel.create({ keyIdentifier, nonce })
  } catch (e) {
    throw new Error(e)
  }
}

export const getUserByEvmAddress = async ({
  evmAddress,
}: {
  evmAddress: string
}) => {
  try {
    const user = await userModel
      .findOne({ keyIdentifier: evmAddress })
      .lean()
      .exec()
    return user
  } catch (e) {
    throw new Error(e)
  }
}

export const getUserByEvmAddressAndNonce = async ({
  evmAddress,
  nonce,
}: {
  evmAddress: string
  nonce: string
}) => {
  try {
    const user = await userModel
      .findOne({ keyIdentifier: evmAddress, nonce })
      .lean()
    return user
  } catch (e) {
    throw new Error(e)
  }
}

export const updateNonce = async ({
  evmAddress,
  nonce,
}: {
  evmAddress: string
  nonce: string
}) => {
  try {
    const user = await userModel
      .findOneAndUpdate({ keyIdentifier: evmAddress }, { nonce })
      .lean()
      .exec()
    return user
  } catch (e) {
    throw new Error(e)
  }
}
