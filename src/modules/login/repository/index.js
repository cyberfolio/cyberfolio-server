const { userModel } = require("./models");
const { deleteMongoVersionAndId } = require("../../../utils");

const createUser = async ({ evmAddress, nonce }) => {
  try {
    await userModel.create({ evmAddress, nonce });
  } catch (e) {
    throw new Error(e);
  }
};

const getUserByEvmAddress = async (evmAddress) => {
  try {
    const user = await userModel.findOne({ evmAddress });
    return deleteMongoVersionAndId(user);
  } catch (e) {
    throw new Error(e);
  }
};

const getUserByEvmAddressAndNonce = async ({ evmAddress, nonce }) => {
  try {
    const user = await userModel.findOne({ evmAddress, nonce });
    return deleteMongoVersionAndId(user);
  } catch (e) {
    throw new Error(e);
  }
};

const updateNonce = async ({ evmAddress, nonce }) => {
  try {
    const user = await userModel.findOneAndUpdate({ evmAddress }, { nonce });
    return deleteMongoVersionAndId(user);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  createUser,
  updateNonce,
  getUserByEvmAddress,
  getUserByEvmAddressAndNonce,
};
