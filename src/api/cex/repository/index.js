const { cexModel } = require("./models");

const addCexByKeyIdentifier = async ({
  keyIdentifier,
  apiKey,
  apiSecret,
  cexName,
}) => {
  const cex = await cexModel.findOne({
    keyIdentifier,
    cexName,
  });
  if (cex) {
    return;
  }

  try {
    await cexModel.create({
      keyIdentifier,
      apiKey,
      apiSecret,
      cexName,
    });
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  addCexByKeyIdentifier,
};
