const { getUserByEvmAddress } = require("../login/repository");
const { addWalletByKeyIdentifier } = require("./repository");

const addEvmWallets = async ({ keyIdentifier, walletAddresses }) => {
  const user = await getUserByEvmAddress(keyIdentifier);
  if (!user) {
    throw new Error("User not found");
  }

  for (const walletAddress of walletAddresses) {
    await addWalletByKeyIdentifier({ keyIdentifier, walletAddress });
  }
};

module.exports = {
  addEvmWallets,
};
