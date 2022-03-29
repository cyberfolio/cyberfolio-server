const { getAssetsAtSpot } = require("../../modules/binance/services");
const { getUserByEvmAddress } = require("../auth/repository");
const {
  addCexByKeyIdentifier,
  addCexHoldingByKeyIdentifier,
  fetchSpotAssets,
  getCexInfoByKeyIdentifier,
} = require("./repository");

const addCex = async ({ keyIdentifier, apiKey, apiSecret, cexName }) => {
  const user = await getUserByEvmAddress({ evmAddress: keyIdentifier });
  if (!user) {
    throw new Error("User not found");
  }
  try {
    await addCexByKeyIdentifier({
      keyIdentifier,
      apiKey,
      apiSecret,
      cexName,
    });
    if (cexName.toLowerCase() === "binance") {
      const assets = await saveBinanceSpotAssets({
        apiKey,
        apiSecret,
        keyIdentifier,
      });
      return assets;
    }
    return [];
  } catch (e) {
    throw new Error(e.message);
  }
};

const getSpotAssets = async ({ keyIdentifier, cexName }) => {
  try {
    const cexInfo = await getCexInfoByKeyIdentifier({
      keyIdentifier,
      cexName,
    });
    await saveBinanceSpotAssets({
      apiKey: cexInfo?.apiKey,
      apiSecret: cexInfo?.apiSecret,
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

const saveBinanceSpotAssets = async ({ apiKey, apiSecret, keyIdentifier }) => {
  try {
    const spotAssets = await getAssetsAtSpot({ apiKey, apiSecret });
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

module.exports = { addCex, getSpotAssets };
