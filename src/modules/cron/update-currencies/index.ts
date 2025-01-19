import AppProviders from '@src/modules/providers';
import AppUtils from '@src/utils';

const path = AppUtils.getFilePath(__filename);

const updateCurrencies = async () => {
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= 6000; i++) {
    try {
      await AppProviders.Coingecko.addOrUpdateCryptoCurrencies(i);
    } catch (e) {
      AppUtils.logError({
        func: updateCurrencies.name,
        path,
        e,
      });
      throw e;
    }
  }
};

export default updateCurrencies;
