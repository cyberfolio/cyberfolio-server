const { deleteMongoVersionAndId } = require("../../../utils");
const { evmWalletsModel } = require("./models");

const addWalletByKeyIdentifier = async ({
  keyIdentifier,
  walletAddress,
  walletName,
  chain,
}) => {
  const wallet = await evmWalletsModel.findOne({
    keyIdentifier,
    walletAddress,
  });
  if (wallet) {
    return;
  }

  await evmWalletsModel.create({
    keyIdentifier,
    walletAddress,
    walletName,
    chain,
  });
};

const getWallet = async ({ keyIdentifier, chain }) => {
  const wallet = await evmWalletsModel.findOne({ keyIdentifier, chain });
  return deleteMongoVersionAndId(wallet);
};

module.exports = {
  addWalletByKeyIdentifier,
  getWallet,
};
