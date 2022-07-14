import { addOrUpdateCryptoCurrencies } from '@providers/coingecko';
import { logError, getFilePath } from '@src/utils';

const path = getFilePath(__filename);

const updateCurrencies = async () => {
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= 6000; i++) {
    try {
      await addOrUpdateCryptoCurrencies(i);
    } catch (e) {
      logError({
        func: updateCurrencies.name,
        path,
        e,
      });
      throw e;
    }
  }
};

export default updateCurrencies;
