const { sleep } = require("../../utils");
const {
  getLastCurrencyUpdate,
  addOrUpdateAllCryptoPriceInUSD,
} = require("../providers/coingecko");

const updateCurrencies = async () => {
  const lastUpdate = await getLastCurrencyUpdate();
  if (lastUpdate) {
    const hourDifference = Math.abs(new Date() - lastUpdate) / 36e5;
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

module.exports = {
  updateCurrencies,
};
