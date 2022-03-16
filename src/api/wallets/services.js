const { getUserByEvmAddress } = require("../login/repository");
const { addWalletByKeyIdentifier } = require("./repository");

const addWallets = async ({ keyIdentifier, wallets }) => {
  const user = await getUserByEvmAddress({ evmAddress: keyIdentifier });
  if (!user) {
    throw new Error("User not found");
  }

  for (const wallet of wallets) {
    const walletAddress = wallet.address;
    const walletName = wallet.name;
    const chain = wallet.chain;
    await addWalletByKeyIdentifier({
      keyIdentifier,
      walletAddress,
      walletName,
      chain,
    });
  }
};

module.exports = {
  addWallets,
};
