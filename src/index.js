require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");

const bitcoin = require("./modules/bitcoin");
const ethereum = require("./modules/ethereum");
const arbitrum = require("./modules/arbitrum");
const avalanche = require("./modules/avalanche");
const polkadot = require("./modules/polkadot");
const smartchain = require("./modules/smartchain");
const polygon = require("./modules/polygon");
const solana = require("./modules/solana");
const binance = require("./modules/binance");

const { updateCoins } = require("./init");

const main = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${process.env.APP_NAME}`);
    cron.schedule("0 0 */1 * * *", async () => {
      // every hour
      console.log("Running cryptoprice update at: " + new Date());
      await updateCoins();
      console.log("Cryptoprice update completed at: " + new Date());
      console.log(" ");
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
  app.use("/api/bitcoin", bitcoin);
  app.use("/api/ethereum", ethereum);
  app.use("/api/arbitrum", arbitrum);
  app.use("/api/avalanche", avalanche);
  app.use("/api/polkadot", polkadot);
  app.use("/api/smartchain", smartchain);
  app.use("/api/polygon", polygon);
  app.use("/api/solana", solana);
  app.use("/api/binance", binance);

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
};

main();
