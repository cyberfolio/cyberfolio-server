const { userModel } = require("./models");
const { deleteMongoVersionAndId } = require("../../../utils");

const createUser = async ({ evmAddress, nonce }) => {
  try {
    await userModel.create({ keyIdentifier: evmAddress, nonce });
  } catch (e) {
    throw new Error(e);
  }
};

const getUserByEvmAddress = async (keyIdentifier) => {
  try {
    const user = await userModel.findOne({ keyIdentifier });
    return deleteMongoVersionAndId(user);
  } catch (e) {
    throw new Error(e);
  }
};

const getUserByEvmAddressAndNonce = async ({ evmAddress, nonce }) => {
  try {
    const user = await userModel.findOne({ keyIdentifier: evmAddress, nonce });
    return deleteMongoVersionAndId(user);
  } catch (e) {
    throw new Error(e);
  }
};

const updateNonce = async ({ evmAddress, nonce }) => {
  try {
    const user = await userModel.findOneAndUpdate(
      { keyIdentifier: evmAddress },
      { nonce }
    );
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
