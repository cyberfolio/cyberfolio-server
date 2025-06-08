import { ApiClient, SpotApi } from 'gate-api';

import AppProviders from '@providers/index';
import axios, { AxiosError } from 'axios';
import AppStructures from '@structures/index';

const getAssets = async ({
  apiKey,
  apiSecret,
}: {
  apiKey: string;
  apiSecret: string;
}): Promise<AppStructures.CexAssetResponse[]> => {
  const client = new ApiClient();
  client.setApiKeySecret(apiKey, apiSecret);

  const spotApi = new SpotApi(client);
  try {
    const accounts = await spotApi.listSpotAccounts({ currency: undefined });

    const assets = accounts?.body;
    const response = [];

    if (assets && assets.length > 0) {
      for (const asset of assets) {
        const { available } = asset;
        const { locked } = asset;
        let balance = parseFloat(available || '0');
        const lockedBalance = parseFloat(locked || '0');

        if (balance > 0.5 || lockedBalance > 0.5) {
          const symbol = String(asset?.currency).toLowerCase();
          const name = await AppProviders.Coingecko.getFullNameOfTheCurrency(symbol);
          const contractAddress = await AppProviders.Coingecko.getContractAddress(symbol);
          balance += lockedBalance;
          const price = await AppProviders.Coingecko.getCurrentUSDPrice(symbol);
          const value = balance * price;
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
              cexName: AppStructures.CexName.GATEIO,
              accountName: AppStructures.CexName.GATEIO,
            });
          }
        }
      }
    }

    return response;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const gateIoError = e as AxiosError<AppStructures.GateIoError>;
      if (gateIoError.response?.data?.code) {
        throw new Error(gateIoError.response.data.code);
      } else {
        throw new Error(e.message);
      }
    } else {
      throw e;
    }
  }
};

const GateioModule = {
  getAssets,
};

export default GateioModule;
