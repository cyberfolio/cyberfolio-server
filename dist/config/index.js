"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = __importDefault(require("./jwt"));
const logger_1 = __importDefault(require("./logger"));
const middleware_1 = __importDefault(require("./middleware"));
const AppConfig = {
    Jwt: jwt_1.default,
    Logger: logger_1.default,
    MiddleWare: middleware_1.default,
};
exports.default = AppConfig;
