import "dotenv/config";
import "module-alias/register";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";

import auth from "./rest/auth";
import dex from "./rest/dex";
import cex from "./rest/cex";
import info from "./rest/info";

import socket from "./socket";

import { init } from "./init";
import { allowedMethods, authenticateUser } from "./config/middleware";

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
