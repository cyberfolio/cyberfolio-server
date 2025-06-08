"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const dex_1 = __importDefault(require("./dex"));
const cex_1 = __importDefault(require("./cex"));
const info_1 = __importDefault(require("./info"));
const AppEndpoints = {
    AuthApi: auth_1.default,
    DexApi: dex_1.default,
    CexApi: cex_1.default,
    InfoApi: info_1.default,
};
exports.default = AppEndpoints;
