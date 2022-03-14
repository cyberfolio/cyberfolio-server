const { getUserByEvmAddress } = require("../login/repository");
const { addWalletByKeyIdentifier } = require("./repository");

const addEvmWallets = async ({ keyIdentifier, wallets }) => {
  console.log("keyIdentifier: " + keyIdentifier);
  const user = await getUserByEvmAddress({ evmAddress: keyIdentifier });
  if (!user) {
    throw new Error("User not found");
  }

  for (const wallet of wallets) {
    const walletAddress = wallet.address;
    const walletName = wallet.name;
    await addWalletByKeyIdentifier({
      keyIdentifier,
      walletAddress,
      walletName,
    });
  }
};

module.exports = {
  addEvmWallets,
};
