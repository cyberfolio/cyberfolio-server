require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");

const auth = require("./rest/auth");
const dex = require("./rest/dex");
const cex = require("./rest/cex");
const info = require("./rest/info");

const socket = require("./socket");

const { init } = require("./init");
const { allowedMethods, authenticateUser } = require("./config/middleware");

const boot = async () => {
  await init();

  const app = express();
  app.use(allowedMethods);
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
      credentials: true,
    })
  );
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  // init api routes
  app.use("/api/auth", auth);
  app.use("/api/cex", authenticateUser, cex);
  app.use("/api/dex", authenticateUser, dex);
  app.use("/api/info", authenticateUser, info);

  // init socket endpoint
  const server = http.createServer(app);
  const io = new Server(server, {
    cookie: true,
  });
  socket(io);

  // start
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
};

boot();
