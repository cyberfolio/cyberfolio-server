"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
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
const Logger = (0, winston_1.createLogger)({
    levels,
    transports: [new winston_1.transports.Console()],
    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp(), winston_1.format.printf(({ timestamp, level, message, metadata }) => `[${timestamp}] ${level}: ${message}. ${metadata ? JSON.stringify(metadata) : ''}`)),
});
exports.default = Logger;
