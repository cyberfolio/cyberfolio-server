import AppUtils from '@utils/index';
import { currencyModel, lastCurrencyUpdateModel } from './models';

const path = AppUtils.getFilePath(__filename);

export const addOrUpdateCryptoCurrency = async ({
  name,
  symbol,
  price,
  image,
}: {
  name: string;
  symbol: string;
  price: number;
  image: string;
}) => {
  if (name && symbol && price) {
    try {
      await currencyModel.findOneAndUpdate(
        { name },
        {
          name,
          symbol,
          price,
          logo: image || '',
        },
        {
          upsert: true, // creates if none
          timestamps: true,
        },
      );
    } catch (e) {
      AppUtils.logError({
        e,
        func: addOrUpdateCryptoCurrency.name,
        path,
      });
      throw e;
    }
  }
};

export const getCryptoPriceBySymbol = async (symbol: string) => {
  try {
    const currency = await currencyModel.findOne({ symbol }).lean();
    return currency?.price ? parseFloat(currency.price.toFixed(2)) : null;
  } catch (e) {
    AppUtils.logError({
      e,
      func: getCryptoPriceBySymbol.name,
      path,
    });
    throw e;
  }
};

export const getCurrencyLogo = async (symbol: string) => {
  try {
    const currency = await currencyModel.findOne({ symbol }).lean();
    return currency?.logo;
  } catch (e) {
    AppUtils.logError({
      e,
      func: getCurrencyLogo.name,
      path,
    });
    throw e;
  }
};

export const getCurrenyInfo = async (symbol: string) => {
  try {
    const currency = await currencyModel.findOne({ symbol }).lean();
    return currency;
  } catch (e) {
    AppUtils.logError({
      e,
      func: getCurrenyInfo.name,
      path,
    });
    throw e;
  }
};

export const getFullNameOfTheCurrencyBySymbol = async (symbol: string) => {
  try {
    const currency = await currencyModel.findOne({ symbol }).lean();
    return currency?.name ? currency.name : '';
  } catch (e) {
    AppUtils.logError({
      e,
      func: getFullNameOfTheCurrencyBySymbol.name,
      path,
    });
    throw e;
  }
};

export const getContractAddressOfTheCurrencyBySymbol = async (symbol: string) => {
  try {
    const currency = await currencyModel.findOne({ symbol }).lean();
    return currency?.contractAddress ? currency.contractAddress : '';
  } catch (e) {
    AppUtils.logError({
      e,
      func: getContractAddressOfTheCurrencyBySymbol.name,
      path,
    });
    throw e;
  }
};

export const setLastCurrencyUpdateDate = async (lastUpdateDate: Date) => {
  try {
    await lastCurrencyUpdateModel.findOneAndUpdate({ id: 1 }, { lastUpdateDate }, { upsert: true }).lean();
  } catch (e) {
    AppUtils.logError({
      e,
      func: setLastCurrencyUpdateDate.name,
      path,
    });
    throw e;
  }
};

export const getLastCurrencyUpdateDate = async () => {
  try {
    const lastCurrencyUpdate = await lastCurrencyUpdateModel.findOne({ id: 1 }).lean();
    return lastCurrencyUpdate?.lastUpdateDate;
  } catch (e) {
    AppUtils.logError({
      e,
      func: getLastCurrencyUpdateDate.name,
      path,
    });
    throw e;
  }
};
