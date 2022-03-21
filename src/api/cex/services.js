const { getUserByEvmAddress } = require("../login/repository");
const { addCexByKeyIdentifier } = require("./repository");

const addCex = async ({ keyIdentifier, apiKey, apiSecret, cexName }) => {
  const user = await getUserByEvmAddress({ evmAddress: keyIdentifier });
  if (!user) {
    throw new Error("User not found");
  }

  await addCexByKeyIdentifier({
    keyIdentifier,
    apiKey,
    apiSecret,
    cexName,
  });
};

module.exports = { addCex };
