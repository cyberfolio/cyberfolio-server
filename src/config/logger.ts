import { createLogger, transports, format } from 'winston';

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  verbose: 5,
  debug: 6,
  silly: 7,
};

const logger = createLogger({
  levels,
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message, metadata }) =>
        `[${timestamp}] ${level}: ${message}. ${metadata ? JSON.stringify(metadata) : ''}`,
    ),
  ),
});

export default logger;
