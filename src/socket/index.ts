const socket = (io: any) => {
  io.on("connection", () => {
    console.log("a user connected");
  });
};

export default socket;
