const { sleep } = require("./utils");
const {
  getLastCurrencyUpdate,
  addOrUpdateAllCryptoPriceInUSD,
} = require("./modules/coingecko");

const updateCoins = async () => {
  const lastUpdate = await getLastCurrencyUpdate();
  if (lastUpdate) {
    const hourDifference = Math.abs(new Date() - lastUpdate) / 36e5;
    if (hourDifference >= 1) {
      for (let i = 1; i <= 99; i++) {
        await addOrUpdateAllCryptoPriceInUSD(i);
        await sleep(500);
      }
    }
  } else {
    for (let i = 1; i <= 99; i++) {
      await addOrUpdateAllCryptoPriceInUSD(i);
      await sleep(500);
    }
  }
};

module.exports = {
  updateCoins,
};
