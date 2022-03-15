const { deleteMongoVersionAndId } = require("../../../utils");
const { walletsModel } = require("./models");

const addWalletByKeyIdentifier = async ({
  keyIdentifier,
  walletAddress,
  walletName,
  chain,
}) => {
  const wallet = await walletsModel.findOne({
    keyIdentifier,
    walletAddress,
  });
  if (wallet) {
    return;
  }

  await walletsModel.create({
    keyIdentifier,
    walletAddress,
    walletName,
    chain,
  });
};

const getWallet = async ({ keyIdentifier, chain }) => {
  const wallet = await walletsModel.findOne({ keyIdentifier, chain });
  return deleteMongoVersionAndId(wallet);
};

module.exports = {
  addWalletByKeyIdentifier,
  getWallet,
};
