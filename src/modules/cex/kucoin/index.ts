import axios, { AxiosError } from 'axios';
import crypto from 'crypto-js';
import AppUtils from '@utils/index';

import AppProviders from '@providers/index';
import AppStructures from '@structures/index';
import { KucoinAccountsApiResponse } from './types';

const API_VERSION = process.env.KUCOIN_API_VERSION as string;
const API_URL = process.env.KUCOIN_API_URL;

const getAssets = async ({
  type,
  apiKey,
  apiSecret,
  passphrase,
}: {
  type: string;
  apiKey: string;
  apiSecret: string;
  passphrase: string;
}): Promise<AppStructures.CexAssetResponse[]> => {
  const timestamp = Date.now().toString();
  const endpoint = `/api/v1/accounts?type=${type}`;
  const stringToSign = `${timestamp}GET${endpoint}`;
  const signedString = crypto.HmacSHA256(stringToSign, apiSecret).toString(crypto.enc.Base64);

  const encryptedApiVersion = crypto.HmacSHA256(API_VERSION, apiSecret).toString(crypto.enc.Base64);

  try {
    const accountInfo = await axios.get<KucoinAccountsApiResponse>(`${API_URL}${endpoint}`, {
      headers: {
        'KC-API-KEY': apiKey,
        'KC-API-SIGN': signedString,
        'KC-API-TIMESTAMP': timestamp,
        'KC-API-PASSPHRASE': passphrase,
        'KC-API-KEY-VERSION': encryptedApiVersion,
      },
    });

    const assets = accountInfo?.data?.data;
    const response: AppStructures.CexAssetResponse[] = [];
    if (assets && assets.length > 0) {
      for (const asset of assets) {
        const balance = AppUtils.roundNumber(Number(asset.holds));
        if (balance > 0) {
          const symbol = asset.currency?.toLowerCase();
          const price = await AppProviders.Coingecko.getCurrentUSDPrice(symbol);
          const name = await AppProviders.Coingecko.getFullNameOfTheCurrency(symbol);
          const contractAddress = await AppProviders.Coingecko.getContractAddress(symbol);
          const value = AppUtils.roundNumber(balance * price);
          const logo = symbol ? await AppProviders.Coingecko.getCurrencyLogo(symbol) : '';

          if (value > 1) {
            response.push({
              name,
              symbol,
              contractAddress,
              balance,
              price,
              value,
              logo,
              cexName: AppStructures.CexName.KUCOIN,
              accountName: AppStructures.CexName.KUCOIN,
            });
          }
        }
      }
    }

    return response;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const gateIoError = e as AxiosError<AppStructures.KucoinError>;
      if (gateIoError.response?.data?.code === '400003') {
        throw new Error('Api key or secret is not valid.');
      } else if (gateIoError.response?.data?.code === '400005') {
        throw new Error('Server error, please contact the admin.');
      } else {
        throw new Error(e.message);
      }
    } else {
      throw e;
    }
  }
};

const KucoinModule = {
  getAssets,
};

export default KucoinModule;
