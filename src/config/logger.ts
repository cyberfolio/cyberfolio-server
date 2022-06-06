import { createLogger, transports, format } from 'winston'

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
}

export const logger = createLogger({
  levels,
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message, metadata }) => {
      return `[${timestamp}] ${level}: ${message}. ${metadata ? JSON.stringify(metadata) : ''}`
    }),
  ),
})
