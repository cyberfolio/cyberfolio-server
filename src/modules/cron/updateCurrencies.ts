import { sleep } from "@src/utils";
import {
  getLastCurrencyUpdate,
  addOrUpdateAllCryptoPriceInUSD,
} from "@providers/coingecko";

export const updateCurrencies = async () => {
  const lastUpdate = await getLastCurrencyUpdate();
  if (lastUpdate) {
    const diff = new Date().valueOf() - lastUpdate.valueOf();
    const hourDifference = diff / 1000 / 60 / 60;
    if (hourDifference >= 1) {
      for (let i = 1; i <= 6000; i++) {
        try {
          await addOrUpdateAllCryptoPriceInUSD(i);
          await sleep(1000);
        } catch (e) {
          throw new Error(e);
        }
      }
    }
  } else {
    for (let i = 1; i <= 6000; i++) {
      try {
        await addOrUpdateAllCryptoPriceInUSD(i);
        await sleep(1000);
      } catch (e) {
        throw new Error(e);
      }
    }
  }
};
