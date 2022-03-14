const mongoose = require("mongoose");
const cron = require("node-cron");

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

const init = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${process.env.APP_NAME}`);
    // every hour
    cron.schedule("0 0 */1 * * *", async () => {
      console.log("Running cryptoprice update at: " + new Date());
      await updateCoins();
      console.log("Cryptoprice update completed at: " + new Date());
      console.log(" ");
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

module.exports = {
  init,
};
