const {
  addCexByKeyIdentifier,
  addCexHoldingByKeyIdentifier,
  fetchSpotAssets,
  getCexInfoByKeyIdentifier,
} = require("./repository");

const binance = require("../../modules/cex/binance/services");
const kucoin = require("../../modules/cex/kucoin/services");
const gateio = require("../../modules/cex/gateio/services");
const { getUserByEvmAddress } = require("../auth/repository");

const addCex = async ({
  keyIdentifier,
  apiKey,
  apiSecret,
  cexName,
  passphrase,
}) => {
  const user = await getUserByEvmAddress({ evmAddress: keyIdentifier });
  if (!user) {
    throw new Error("User not found");
  }

  try {
    await checkIfExists({ keyIdentifier, cexName });
    const assets = await saveSpotAssets({
      cexName,
      apiKey,
      apiSecret,
      keyIdentifier,
      passphrase,
    });
    await addCexByKeyIdentifier({
      keyIdentifier,
      apiKey,
      apiSecret,
      cexName,
      passphrase,
    });
    return assets;
  } catch (e) {
    throw new Error(e.message);
  }
};

const checkIfExists = async ({ keyIdentifier, cexName }) => {
  const cexInfo = await getCexInfoByKeyIdentifier({
    keyIdentifier,
    cexName,
  });
  if (cexInfo) {
    throw new Error(`You have already added ${cexName}`);
  }
};

const getSpotAssets = async ({ keyIdentifier, cexName }) => {
  try {
    const cexInfo = await getCexInfoByKeyIdentifier({
      keyIdentifier,
      cexName,
    });
    if (!cexInfo) {
      return [];
    }
    await saveSpotAssets({
      cexName,
      apiKey: cexInfo?.apiKey,
      apiSecret: cexInfo?.apiSecret,
      passphrase: cexInfo?.passphrase,
      keyIdentifier,
    });
    const assets = await fetchSpotAssets({
      keyIdentifier,
      cexName,
    });
    return assets;
  } catch (e) {
    throw new Error(e.message);
  }
};

const saveSpotAssets = async ({
  cexName,
  apiKey,
  apiSecret,
  passphrase,
  keyIdentifier,
}) => {
  let spotAssets = [];
  try {
    if (cexName.toLowerCase() === "binance") {
      spotAssets = await binance.getAssets({ apiKey, apiSecret });
    } else if (cexName.toLowerCase() === "kucoin") {
      spotAssets = await kucoin.getAssets({
        type: "main",
        apiKey,
        apiSecret,
        passphrase,
      });
    } else if (cexName.toLowerCase() === "gateio") {
      spotAssets = await gateio.getAssets({
        apiKey,
        apiSecret,
      });
    }
    if (Array.isArray(spotAssets) && spotAssets.length > 0) {
      try {
        for (let i = 0; i < spotAssets.length; i++) {
          await addCexHoldingByKeyIdentifier({
            name: spotAssets[i].name,
            symbol: spotAssets[i].symbol,
            balance: spotAssets[i].balance,
            price: spotAssets[i].price,
            value: spotAssets[i].value,
            cexName: spotAssets[i].cexName,
            keyIdentifier,
          });
        }
      } catch (e) {
        throw new Error(e.message);
      }
    }
    return spotAssets;
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = { addCex, getSpotAssets, checkIfExists };
