import axios from 'axios';

import { getFilePath, logError, sleep } from '@src/utils';
import {
  addOrUpdateCryptoCurrency,
  getCryptoPriceBySymbol,
  getLastCurrencyUpdateDate,
  getFullNameOfTheCurrencyBySymbol,
  getContractAddressOfTheCurrencyBySymbol,
} from './repository';

const path = getFilePath(__filename);

export const addOrUpdateCryptoCurrencies = async (page: number) => {
  try {
    const response = await axios({
      url: `${process.env.COINGECKO_V3_API_URL}/coins/markets?vs_currency=usd&page=${page}`,
      method: 'get',
    });
    await sleep(5000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cryptoCurrencies = response?.data as any[];

    if (cryptoCurrencies && Array.isArray(cryptoCurrencies)) {
      for (const cryptoCurrency of cryptoCurrencies) {
        if (cryptoCurrency.symbol && cryptoCurrency.current_price) {
          await addOrUpdateCryptoCurrency({
            name: cryptoCurrency.name,
            symbol: cryptoCurrency.symbol?.toLowerCase(),
            price: parseFloat(cryptoCurrency.current_price),
            image: cryptoCurrency.image,
          });
        }
      }
    }
  } catch (e) {
    logError({
      e,
      func: addOrUpdateCryptoCurrencies.name,
      path,
    });
    throw e;
  }
};

export const getCurrentUSDPrice = async (symbol: string) => {
  const price = await getCryptoPriceBySymbol(symbol);
  return price || 0;
};

export const getFullNameOfTheCurrency = async (symbol: string) => {
  const fullName = await getFullNameOfTheCurrencyBySymbol(symbol);
  return String(fullName);
};

export const getLastCurrencyUpdate = async () => getLastCurrencyUpdateDate();

export const getContractAddress = async (symbol: string) => getContractAddressOfTheCurrencyBySymbol(symbol);
