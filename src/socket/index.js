const socket = (io) => {
  io.on("connection", () => {
    console.log("a user connected");
  });
};

module.exports = socket;
