import Binance from '@cex//binance';
import BinanceTR from '@cex/binancetr';
import Kucoin from '@cex/kucoin';
import GateIO from '@cex/gateio';
import Ftx from '@cex/ftx';
import { TransactionType } from '@cex/binance/types';

import { onError, sleep, timestampToReadableDate } from '@src/utils';
import { CexAssetResponse, CexName } from '@config/types';
import repository from './repository';
import { PaymentHistoryResponse } from './types';

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

const getPaymentHistory = async ({ keyIdentifier }: { keyIdentifier: string }): Promise<PaymentHistoryResponse[]> => {
  const keys = await repository.getCexInfo({ keyIdentifier, cexName: CexName.BINANCE });
  const response: PaymentHistoryResponse[] = [];
  if (keys) {
    await sleep(2000);
    const creditCardPayment = await Binance.getFiatPaymentBuyAndSellHistory({
      apiKey: keys?.apiKey,
      apiSecret: keys.apiSecret,
      transactionType: TransactionType.DEPOSIT,
    });
    await sleep(3000);
    const bankPayment = await Binance.getFiatDepositAndWithDrawalHistory({
      apiKey: keys?.apiKey,
      apiSecret: keys.apiSecret,
      transactionType: TransactionType.DEPOSIT,
    });
    await sleep(3000);
    const creditCardWithdrawal = await Binance.getFiatPaymentBuyAndSellHistory({
      apiKey: keys?.apiKey,
      apiSecret: keys.apiSecret,
      transactionType: TransactionType.WITHDRAW,
    });
    await sleep(3000);
    const bankWithdrawal = await Binance.getFiatDepositAndWithDrawalHistory({
      apiKey: keys?.apiKey,
      apiSecret: keys.apiSecret,
      transactionType: TransactionType.WITHDRAW,
    });

    const creditCardWithdrawalRes: PaymentHistoryResponse[] = creditCardWithdrawal.data.map((item) => {
      const fee = Number(item.totalFee).toLocaleString('en-US', {
        style: 'currency',
        currency: item.fiatCurrency,
      });
      const amount = Number(item.obtainAmount).toLocaleString('en-US', {
        style: 'currency',
        currency: item.fiatCurrency,
      });
      return {
        cex: CexName.BINANCE,
        orderNo: item.orderNo,
        type: 'Card Withdrawal',
        fee,
        status: item.status,
        date: timestampToReadableDate(item.createTime),
        createTime: item.createTime,
        amount,
      };
    });
    const bankWithdrawalRes: PaymentHistoryResponse[] = bankWithdrawal.data.map((item) => {
      const fee = Number(item.totalFee).toLocaleString('en-US', {
        style: 'currency',
        currency: item.fiatCurrency,
      });
      const amount = Number(item.amount).toLocaleString('en-US', {
        style: 'currency',
        currency: item.fiatCurrency,
      });
      return {
        cex: CexName.BINANCE,
        orderNo: item.orderNo,
        type: 'Bank Withdrawal',
        fee,
        status: item.status,
        createTime: item.createTime,
        date: timestampToReadableDate(item.createTime),
        amount,
      };
    });
    const bankPaymentRes: PaymentHistoryResponse[] = bankPayment.data.map((item) => {
      const fee = Number(item.totalFee).toLocaleString('en-US', {
        style: 'currency',
        currency: item.fiatCurrency,
      });
      const amount = Number(item.indicatedAmount).toLocaleString('en-US', {
        style: 'currency',
        currency: item.fiatCurrency,
      });
      return {
        cex: CexName.BINANCE,
        orderNo: item.orderNo,
        type: 'Bank Deposit',
        fee,
        status: item.status,
        createTime: item.createTime,
        date: timestampToReadableDate(item.createTime),
        amount,
      };
    });
    const creditCardPaymentRes: PaymentHistoryResponse[] = creditCardPayment.data.map((item) => {
      const fee = Number(item.totalFee).toLocaleString('en-US', {
        style: 'currency',
        currency: item.fiatCurrency,
      });
      const amount = Number(item.sourceAmount).toLocaleString('en-US', {
        style: 'currency',
        currency: item.fiatCurrency,
      });
      return {
        cex: CexName.BINANCE,
        orderNo: item.orderNo,
        type: 'Card Payment',
        fee,
        status: item.status,
        createTime: item.createTime,
        date: timestampToReadableDate(item.createTime),
        amount,
      };
    });
    response.push(...creditCardPaymentRes, ...bankPaymentRes, ...creditCardWithdrawalRes, ...bankWithdrawalRes);
  }
  const sortedRes = response.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
  return sortedRes;
};

const CexService = {
  checkIfExists,
  getAvailableCexes,
  saveSpotAssets,
  getSpotAssets,
  getAssets,
  getPaymentHistory,
  add,
  deleteCex,
};

export default CexService;
