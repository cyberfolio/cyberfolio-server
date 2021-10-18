require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");

const ethereum = require("./modules/ethereum");
const avalanche = require("./modules/avalanche");
const smartchain = require("./modules/smartchain");
const binance = require("./modules/binance");
const coingecko = require("./modules/coingecko");
const { sleep } = require("./utils");

const main = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${process.env.APP_NAME}`);
    await updateCoins();
    cron.schedule("0 0 */1 * * *", async () => {
      // every hour
      console.log("Ran cryptoprice update");
      await updateCoins();
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }

  const app = express();
  const port = process.env.PORT;

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  // Api Routes
  app.use("/api/ethereum", ethereum);
  app.use("/api/avalanche", avalanche);
  app.use("/api/smartchain", smartchain);
  app.use("/api/binance", binance);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

const updateCoins = async () => {
  const lastUpdate = await coingecko.getLastCurrencyUpdate();
  if (lastUpdate) {
    const hourDifference = Math.abs(new Date() - lastUpdate) / 36e5;
    if (hourDifference >= 1) {
      for (let i = 1; i <= 99; i++) {
        await coingecko.addOrUpdateAllCryptoPriceInUSD(i);
        await sleep(500);
      }
    }
  } else {
    for (let i = 1; i <= 99; i++) {
      await coingecko.addOrUpdateAllCryptoPriceInUSD(i);
      await sleep(500);
    }
  }
};

main();
