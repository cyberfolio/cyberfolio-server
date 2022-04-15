import { currencyModel, lastCurrencyUpdateModel } from "./models";

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
          logo: image ? image : "",
        },
        {
          upsert: true, // creates if none
          timestamps: true,
        }
      );
    } catch (e) {
      throw new Error(e);
    }
  }
};

export const getCryptoPriceBySymbol = async (symbol: string) => {
  try {
    const currency = await currencyModel.findOne({ symbol });
    return currency?.price ? parseFloat(currency.price.toFixed(2)) : null;
  } catch (e) {
    throw new Error(e);
  }
};

export const getCurrenyInfo = async (symbol: string) => {
  try {
    const currency = await currencyModel.findOne({ symbol });
    return currency;
  } catch (e) {
    throw new Error(e);
  }
};

export const getFullNameOfTheCurrencyBySymbol = async (symbol: string) => {
  try {
    const currency = await currencyModel.findOne({ symbol });
    return currency?.name ? currency.name : "";
  } catch (e) {
    throw new Error(e);
  }
};

export const getContractAddressOfTheCurrencyBySymbol = async (
  symbol: string
) => {
  try {
    const currency = await currencyModel.findOne({ symbol });
    return currency?.contractAddress ? currency.contractAddress : "";
  } catch (e) {
    throw new Error(e);
  }
};

export const setLastCurrencyUpdateDate = async (lastUpdateDate: Date) => {
  try {
    await lastCurrencyUpdateModel.findOneAndUpdate(
      { id: 1 },
      { lastUpdateDate },
      { upsert: true }
    );
  } catch (e) {
    throw new Error(e);
  }
};

export const getLastCurrencyUpdateDate = async (): Promise<Date> => {
  try {
    const lastCurrencyUpdate = await lastCurrencyUpdateModel.findOne({ id: 1 });
    return lastCurrencyUpdate?.lastUpdateDate;
  } catch (e) {
    throw new Error(e);
  }
};
