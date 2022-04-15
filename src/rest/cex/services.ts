import * as binance from "@cex/binance/services";
import * as kucoin from "@cex/kucoin/services";
import * as gateio from "@cex/gateio/services";

import * as repository from "./repository";

export const checkIfExists = async ({
  keyIdentifier,
  cexName,
}: {
  keyIdentifier: string;
  cexName: string;
}) => {
  const cexInfo = await repository.getCexInfo({
    keyIdentifier,
    cexName,
  });
  if (cexInfo) {
    throw new Error(`You have already added ${cexName}`);
  }
};

export const addCex = async ({
  keyIdentifier,
  apiKey,
  apiSecret,
  cexName,
  passphrase,
}: {
  keyIdentifier: string;
  apiKey: string;
  apiSecret: string;
  cexName: string;
  passphrase: string;
}) => {
  try {
    await checkIfExists({ keyIdentifier, cexName });
    const assets = await saveSpotAssets({
      cexName,
      apiKey,
      apiSecret,
      keyIdentifier,
      passphrase,
    });
    await repository.addCexByKeyIdentifier({
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

export const saveSpotAssets = async ({
  cexName,
  apiKey,
  apiSecret,
  passphrase,
  keyIdentifier,
}: {
  cexName: string;
  apiKey: string;
  apiSecret: string;
  passphrase: string;
  keyIdentifier: string;
}) => {
  let spotAssets = [] as any;
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
          await repository.addCexAsset({
            name: spotAssets[i].name,
            symbol: spotAssets[i].symbol?.toLowerCase(),
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

export const getSpotAssets = async ({
  keyIdentifier,
  cexName,
}: {
  keyIdentifier: string;
  cexName: string;
}) => {
  try {
    const cexInfo = await repository.getCexInfo({
      keyIdentifier,
      cexName,
    });
    if (!cexInfo) {
      return [];
    }
    const assets = await repository.fetchSpotAssets({
      keyIdentifier,
      cexName,
    });
    return assets;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const getAllSpot = async ({
  keyIdentifier,
}: {
  keyIdentifier: string;
}) => {
  try {
    const assets = await repository.fetchAllSpotAssets({
      keyIdentifier,
    });
    return assets;
  } catch (e) {
    throw new Error(e.message);
  }
};
