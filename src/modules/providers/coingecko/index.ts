import axios from "axios";

import { getFilePath, logError, sleep } from "@src/utils";
import {
  addOrUpdateCryptoCurrency,
  getCryptoPriceBySymbol,
  getLastCurrencyUpdateDate,
  getFullNameOfTheCurrencyBySymbol,
  getContractAddressOfTheCurrencyBySymbol,
} from "./repository";

const path = getFilePath(__filename);

export const addOrUpdateCryptoCurrencies = async (page: number) => {
  try {
    const response = await axios({
      url: `${process.env.COINGECKO_V3_API_URL}/coins/markets?vs_currency=usd&page=${page}`,
      method: "get",
    });
    await sleep(5000);
    const cryptoCurrencies = response?.data as any[];

    if (cryptoCurrencies && Array.isArray(cryptoCurrencies)) {
      for (let i = 0; i < cryptoCurrencies.length; i++) {
        if (cryptoCurrencies[i].symbol && cryptoCurrencies[i].current_price) {
          await addOrUpdateCryptoCurrency({
            name: cryptoCurrencies[i].name,
            symbol: cryptoCurrencies[i].symbol?.toLowerCase(),
            price: parseFloat(cryptoCurrencies[i].current_price),
            image: cryptoCurrencies[i].image,
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
  return price ? price : 0;
};

export const getFullNameOfTheCurrency = async (symbol: string) => {
  return await getFullNameOfTheCurrencyBySymbol(symbol);
};

export const getLastCurrencyUpdate = async () => {
  return await getLastCurrencyUpdateDate();
};

export const getContractAddress = async (symbol: string) => {
  return await getContractAddressOfTheCurrencyBySymbol(symbol);
};
