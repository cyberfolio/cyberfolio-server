const { evmWalletsModel } = require("./models");

const addWalletByKeyIdentifier = async ({
  keyIdentifier,
  walletAddress,
  walletName,
}) => {
  const wallet = await evmWalletsModel.findOne({ keyIdentifier });
  if (wallet) {
    return;
  }

  await evmWalletsModel.create({
    keyIdentifier,
    walletAddress,
    walletName,
  });
};

module.exports = {
  addWalletByKeyIdentifier,
};
