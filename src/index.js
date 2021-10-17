require("dotenv").config();

const express = require("express");

const eth = require("./modules/eth");
const binance = require("./modules/binance");

const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
app.use("/api/eth", eth);
app.use("/api/binance", binance);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

