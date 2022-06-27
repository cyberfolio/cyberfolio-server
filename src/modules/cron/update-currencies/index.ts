import { addOrUpdateCryptoCurrencies } from "@providers/coingecko";
import { logError, getFilePath } from "@src/utils";

const path = getFilePath(__filename);

export const updateCurrencies = async () => {
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
