import Binance from '@cex//binance';
import BinanceTR from '@cex/binancetr';
import Kucoin from '@cex/kucoin';
import GateIO from '@cex/gateio';
import Ftx from '@cex/ftx';

import { onError, timestampToReadableDate } from '@src/utils';
import { CexAssetResponse, CexName } from '@config/types';
import repository from './repository';
import { CexPaymentHistory } from './types';

const checkIfExists = async ({ keyIdentifier, cexName }: { keyIdentifier: string; cexName: CexName }) => {
  const cexInfo = await repository.getCexInfo({
    keyIdentifier,
    cexName,
  });
  if (cexInfo !== null) {
    throw new Error(`You have already added ${cexName}`);
  }
};

const getAvailableCexes = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  const cexInfo = await repository.getCexInfos({
    keyIdentifier,
  });
  return cexInfo;
};

const saveSpotAssets = async ({
  cexName,
  apiKey,
  apiSecret,
  passphrase,
  keyIdentifier,
}: {
  cexName: CexName;
  apiKey: string;
  apiSecret: string;
  passphrase: string;
  keyIdentifier: string;
}) => {
  let spotAssets: CexAssetResponse[] = [];
  try {
    if (cexName === CexName.BINANCE) {
      spotAssets = await Binance.getAssets({ apiKey, apiSecret });
    } else if (cexName === CexName.BINANCETR) {
      spotAssets = await BinanceTR.getAssets({ apiKey, apiSecret });
    } else if (cexName === CexName.KUCOIN) {
      spotAssets = await Kucoin.getAssets({
        type: 'main',
        apiKey,
        apiSecret,
        passphrase,
      });
    } else if (cexName === CexName.GATEIO) {
      spotAssets = await GateIO.getAssets({
        apiKey,
        apiSecret,
      });
    } else if (cexName === CexName.FTX) {
      spotAssets = await Ftx.getAssets({
        apiKey,
        apiSecret,
      });
    } else {
      throw new Error(`We do not support ${cexName} currently.`);
    }
    if (Array.isArray(spotAssets) && spotAssets.length > 0) {
      try {
        for (const spotAsset of spotAssets) {
          await repository.addCexAsset({
            keyIdentifier,
            name: spotAsset.name,
            symbol: spotAsset.symbol?.toLowerCase(),
            balance: spotAsset.balance,
            price: spotAsset.price,
            value: spotAsset.value,
            cexName: spotAsset.cexName,
            logo: spotAsset.logo,
            accountName: spotAsset.accountName,
          });
        }
      } catch (e) {
        const error = onError(e);
        throw error;
      }
    }
    return spotAssets;
  } catch (e) {
    const error = onError(e);
    throw error;
  }
};

const getSpotAssets = async ({ keyIdentifier, cexName }: { keyIdentifier: string; cexName: CexName }) => {
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
    const error = onError(e);
    throw error;
  }
};

const add = async ({
  keyIdentifier,
  apiKey,
  apiSecret,
  cexName,
  passphrase,
}: {
  keyIdentifier: string;
  apiKey: string;
  apiSecret: string;
  cexName: CexName;
  passphrase: string;
}) => {
  try {
    await checkIfExists({ keyIdentifier, cexName });
    await saveSpotAssets({
      cexName,
      apiKey,
      apiSecret,
      keyIdentifier,
      passphrase,
    });
    await savePaymentHistory({
      apiKey,
      apiSecret,
      keyIdentifier,
      cexName,
    });
    await repository.addCexByKeyIdentifier({
      keyIdentifier,
      apiKey,
      apiSecret,
      cexName,
      passphrase,
    });
  } catch (e) {
    const error = onError(e);
    throw error;
  }
};

const deleteCex = async ({ keyIdentifier, cexName }: { keyIdentifier: string; cexName: CexName }) => {
  try {
    await repository.deleteCex({
      keyIdentifier,
      cexName,
    });
  } catch (e) {
    const error = onError(e);
    throw error;
  }
};

const getAssets = async ({ keyIdentifier }: { keyIdentifier: string }) => {
  try {
    const assets = await repository.fetchAllSpotAssets({
      keyIdentifier,
    });
    return assets;
  } catch (e) {
    const error = onError(e);
    throw error;
  }
};

const savePaymentHistory = async ({
  keyIdentifier,
  cexName,
  apiKey,
  apiSecret,
}: {
  keyIdentifier: string;
  cexName: CexName;
  apiKey: string;
  apiSecret: string;
}): Promise<CexPaymentHistory[]> => {
  const response = [];
  if (cexName === CexName.BINANCE) {
    const binancePaymentHistory = await Binance.getPaymentHistory({ apiKey, apiSecret });
    try {
      for (const item of binancePaymentHistory) {
        await repository.savePaymentHistory({
          keyIdentifier,
          cexPaymentHistory: item,
        });
      }
    } catch (e) {
      const error = onError(e);
      throw error;
    }
    response.push(...binancePaymentHistory);
  }
  return response;
};

const getPaymentHistory = async ({ keyIdentifier }: { keyIdentifier: string }): Promise<CexPaymentHistory[]> => {
  const history = await repository.getPaymentHistory({
    keyIdentifier,
  });
  const leanhistory = history.map((item) => {
    const fee = Number(item.fee).toLocaleString('en-US', {
      style: 'currency',
      currency: item.fiatCurrency,
    });
    const amount = Number(item.amount).toLocaleString('en-US', {
      style: 'currency',
      currency: item.fiatCurrency,
    });
    return {
      cexName: CexName.BINANCE,
      orderNo: item.orderNo,
      type: item.type,
      fee,
      status: item.status,
      createTime: item.createTime,
      date: timestampToReadableDate(item.createTime),
      fiatCurrency: item.fiatCurrency,
      amount,
    };
  });
  return leanhistory;
};

const CexService = {
  checkIfExists,
  getAvailableCexes,
  saveSpotAssets,
  getSpotAssets,
  getAssets,
  savePaymentHistory,
  getPaymentHistory,
  add,
  deleteCex,
};

export default CexService;
