import axios from 'axios';

import AppUtils from '@utils/index';
import {
  addOrUpdateCryptoCurrency,
  getCryptoPriceBySymbol,
  getLastCurrencyUpdateDate,
  getFullNameOfTheCurrencyBySymbol,
  getContractAddressOfTheCurrencyBySymbol,
  getCurrencyLogo,
} from './repository';

const path = AppUtils.getFilePath(__filename);

const addOrUpdateCryptoCurrencies = async (page: number) => {
  try {
    const response = await axios({
      url: `${process.env.COINGECKO_V3_API_URL}/coins/markets?vs_currency=usd&page=${page}`,
      method: 'get',
    });
    await AppUtils.sleep(10000);
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
    AppUtils.logError({
      e,
      func: addOrUpdateCryptoCurrencies.name,
      path,
    });
    throw e;
  }
};

const getCurrentUSDPrice = async (symbol: string) => {
  const price = await getCryptoPriceBySymbol(symbol);
  return price || 0;
};

const getFullNameOfTheCurrency = async (symbol: string) => {
  const fullName = await getFullNameOfTheCurrencyBySymbol(symbol);
  return String(fullName);
};

const getLastCurrencyUpdate = async () => getLastCurrencyUpdateDate();

const getContractAddress = async (symbol: string) => getContractAddressOfTheCurrencyBySymbol(symbol);

const CoingeckoProvider = {
  addOrUpdateCryptoCurrencies,
  getCurrentUSDPrice,
  getFullNameOfTheCurrency,
  getLastCurrencyUpdate,
  getContractAddress,
  getCurrencyLogo,
};

export default CoingeckoProvider;
