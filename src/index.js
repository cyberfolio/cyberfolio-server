require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const ethereum = require("./modules/ethereum");
const binance = require("./modules/binance");
const coingecko = require("./modules/coingecko");

const main = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${process.env.APP_NAME}`);
    for (let i = 1; i < 51; i++) {
      await coingecko.addOrUpdateAllCryptoPriceInUSD(i);
    }
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
  app.use("/api/binance", binance);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

main();
