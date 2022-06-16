import { logger } from "@config/logger";

const socket = (io: any) => {
  io.on("connection", () => {
    logger.info("A user connected");
  });
};

export default socket;
