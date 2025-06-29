import axios, { AxiosError } from 'axios';
import crypto from 'crypto-js';

import AppUtils from '@utils/index';
import AppProviders from '@providers/index';
import AppStructures from '@structures/index';
import { BinanceTRAccountAPIResponse } from './types';

const API_URL = process.env.BINANCETR_API_URL;

const getAssets = async ({
  apiKey,
  apiSecret,
}: {
  apiKey: string;
  apiSecret: string;
}): Promise<AppStructures.CexAssetResponse[]> => {
  const queryString = `timestamp=${Date.now()}`;
  const signature = crypto.HmacSHA256(queryString, apiSecret).toString(crypto.enc.Hex);
  try {
    const accountInfo = await axios.get<BinanceTRAccountAPIResponse>(
      `${API_URL}/open/v1/account/spot?${queryString}&signature=${signature}`,
      {
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      },
    );
    if (accountInfo.data.code === 3700) {
      throw new Error('You provided wrong api key');
    }
    if (accountInfo.data.code === 3702) {
      throw new Error('You provided wrong api secret');
    }
    if (accountInfo.data.code === 404) {
      throw new Error('You provided wrong api key or secret');
    }
    if (accountInfo.data.msg !== 'Success') {
      throw new Error('Something went wrong');
    }
    const assets = accountInfo.data?.data?.accountAssets?.filter(
      (accountAsset) => parseFloat(accountAsset.free) + parseFloat(accountAsset.locked) > 1,
    );
    const response: AppStructures.CexAssetResponse[] = [];
    if (Array.isArray(assets) && assets.length > 0) {
      for (const asset of assets) {
        const symbol = asset.asset?.toLowerCase();
        const name = await AppProviders.Coingecko.getFullNameOfTheCurrency(symbol);
        const price = await AppProviders.Coingecko.getCurrentUSDPrice(symbol);
        const balance = parseFloat(asset.free) + parseFloat(asset.locked);
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
            cexName: AppStructures.CexName.BINANCETR,
            accountName: AppStructures.CexName.BINANCETR,
          });
        }
      }
    }
    return response;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const binanceError = e as AxiosError<AppStructures.BinanceError>;
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

const BinanceTRModule = {
  getAssets,
};

export default BinanceTRModule;
