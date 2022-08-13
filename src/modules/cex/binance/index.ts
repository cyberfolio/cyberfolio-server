import axios, { AxiosError } from 'axios';
import crypto from 'crypto-js';

import { roundNumber, sleep, timestampToReadableDate } from '@src/utils';
import { getCurrentUSDPrice, getFullNameOfTheCurrency, getContractAddress } from '@providers/coingecko';
import { BinanceError, CexAssetResponse, CexName } from '@config/types';
import { getCurrencyLogo } from '@providers/coingecko/repository';
import {
  BinanceAccountAPIResponse,
  BinanceFiatDepositAPIResponse,
  BinanceFiatPaymentAPIResponse,
  BinancePaymentHistory,
  TransactionType,
} from './types';

const API_URL = process.env.BINANCE_API_URL;

const getAssets = async ({ apiKey, apiSecret }: { apiKey: string; apiSecret: string }): Promise<CexAssetResponse[]> => {
  const queryString = `timestamp=${Date.now()}`;
  const signature = crypto.HmacSHA256(queryString, apiSecret).toString(crypto.enc.Hex);
  try {
    const accountInfo = await axios.get<BinanceAccountAPIResponse>(
      `${API_URL}/api/v3/account?${queryString}&signature=${signature}`,
      {
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      },
    );

    const assets = accountInfo.data?.balances?.filter(
      (balance) => parseFloat(balance.free) + parseFloat(balance.locked) > 1,
    );
    const response: CexAssetResponse[] = [];
    if (Array.isArray(assets) && assets.length > 0) {
      for (const asset of assets) {
        const symbol = asset.asset?.toLowerCase();
        const name = await getFullNameOfTheCurrency(symbol);
        const price = await getCurrentUSDPrice(symbol);
        const balance = parseFloat(asset.free) + parseFloat(asset.locked);
        const contractAddress = await getContractAddress(symbol);
        const value = roundNumber(balance * price);
        const logo = symbol ? await getCurrencyLogo(symbol) : '';
        if (value > 1) {
          response.push({
            name,
            symbol,
            contractAddress,
            balance,
            price,
            value,
            logo,
            cexName: CexName.BINANCE,
            accountName: CexName.BINANCE,
          });
        }
      }
    }
    return response;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const binanceError = e as AxiosError<BinanceError>;
      if (binanceError.response?.data?.code === -1022) {
        throw new Error('API Secret is invalid');
      }
      if (binanceError.response?.data?.code === -2015) {
        throw new Error('API key is invalid or IP restricted or permissions are missing');
      } else if (binanceError.response?.data?.msg) {
        throw new Error(binanceError.response.data.msg);
      } else {
        throw new Error(e.message);
      }
    } else {
      throw e;
    }
  }
};

const getFiatDepositAndWithDrawalHistory = async ({
  transactionType,
  apiKey,
  apiSecret,
}: {
  transactionType: TransactionType;
  apiKey: string;
  apiSecret: string;
}) => {
  const queryString = `transactionType=${transactionType}&timestamp=${Date.now()}&beginTime=${new Date(
    '01.01.2016',
  ).getTime()}`;
  const signature = crypto.HmacSHA256(queryString, apiSecret).toString(crypto.enc.Hex);
  try {
    const response = await axios.get<BinanceFiatDepositAPIResponse>(
      `${API_URL}/sapi/v1/fiat/orders?${queryString}&signature=${signature}`,
      {
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      },
    );

    const { data } = response;
    return data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const binanceError = e as AxiosError<BinanceError>;
      if (binanceError.response?.data?.msg) {
        throw new Error(binanceError.response.data.msg);
      } else {
        throw new Error(e.message);
      }
    } else {
      throw e;
    }
  }
};

const getFiatPaymentBuyAndSellHistory = async ({
  transactionType,
  apiKey,
  apiSecret,
}: {
  transactionType: TransactionType;
  apiKey: string;
  apiSecret: string;
}) => {
  const queryString = `transactionType=${transactionType}&timestamp=${Date.now()}&beginTime=${new Date(
    '01.01.2016',
  ).getTime()}`;
  const signature = crypto.HmacSHA256(queryString, apiSecret).toString(crypto.enc.Hex);
  try {
    const response = await axios.get<BinanceFiatPaymentAPIResponse>(
      `${API_URL}/sapi/v1/fiat/payments?${queryString}&signature=${signature}`,
      {
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      },
    );
    const { data } = response;
    return data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const binanceError = e as AxiosError<BinanceError>;
      if (binanceError.response?.data?.msg) {
        throw new Error(binanceError.response.data.msg);
      } else {
        throw new Error(e.message);
      }
    } else {
      throw e;
    }
  }
};

type GetPaymentHistory = {
  apiKey: string;
  apiSecret: string;
};
const getPaymentHistory = async ({ apiKey, apiSecret }: GetPaymentHistory) => {
  const response: BinancePaymentHistory[] = [];
  await sleep(2000);
  const creditCardPayment = await getFiatPaymentBuyAndSellHistory({
    apiKey,
    apiSecret,
    transactionType: TransactionType.DEPOSIT,
  });
  await sleep(3000);
  const bankPayment = await getFiatDepositAndWithDrawalHistory({
    apiKey,
    apiSecret,
    transactionType: TransactionType.DEPOSIT,
  });
  await sleep(3000);
  const creditCardWithdrawal = await getFiatPaymentBuyAndSellHistory({
    apiKey,
    apiSecret,
    transactionType: TransactionType.WITHDRAW,
  });
  await sleep(3000);
  const bankWithdrawal = await getFiatDepositAndWithDrawalHistory({
    apiKey,
    apiSecret,
    transactionType: TransactionType.WITHDRAW,
  });

  const creditCardWithdrawalRes = creditCardWithdrawal.data.map((item) => {
    return {
      cexName: CexName.BINANCE,
      fiatCurrency: item.fiatCurrency,
      orderNo: item.orderNo,
      type: 'Card Withdrawal',
      status: item.status,
      date: timestampToReadableDate(item.createTime),
      createTime: item.createTime,
      fee: item.totalFee,
      amount: item.obtainAmount,
    };
  });
  const bankWithdrawalRes = bankWithdrawal.data.map((item) => {
    return {
      cexName: CexName.BINANCE,
      fiatCurrency: item.fiatCurrency,
      orderNo: item.orderNo,
      type: 'Bank Withdrawal',
      status: item.status,
      createTime: item.createTime,
      date: timestampToReadableDate(item.createTime),
      fee: item.totalFee,
      amount: item.amount,
    };
  });
  const bankPaymentRes = bankPayment.data.map((item) => {
    return {
      cexName: CexName.BINANCE,
      fiatCurrency: item.fiatCurrency,
      orderNo: item.orderNo,
      type: 'Bank Deposit',
      status: item.status,
      createTime: item.createTime,
      date: timestampToReadableDate(item.createTime),
      amount: item.indicatedAmount,
      fee: item.totalFee,
    };
  });
  const creditCardPaymentRes = creditCardPayment.data.map((item) => {
    return {
      cexName: CexName.BINANCE,
      fiatCurrency: item.fiatCurrency,
      orderNo: item.orderNo,
      type: 'Card Payment',
      status: item.status,
      createTime: item.createTime,
      date: timestampToReadableDate(item.createTime),
      amount: item.sourceAmount,
      fee: item.totalFee,
    };
  });
  response.push(...creditCardPaymentRes, ...bankPaymentRes, ...creditCardWithdrawalRes, ...bankWithdrawalRes);
  const sortedRes = response.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
  return sortedRes;
};

export default {
  getAssets,
  getPaymentHistory,
};
