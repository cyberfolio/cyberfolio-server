"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv-safe/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const init_1 = require("./init");
const config_1 = __importDefault(require("./config"));
const api_1 = __importDefault(require("./api"));
if (process.env.NODE_ENV !== 'development') {
    Promise.resolve().then(() => __importStar(require('module-alias/register'))).catch((e) => {
        config_1.default.Logger.error('Error while registering module-alias', e);
    });
}
const boot = async () => {
    await (0, init_1.connectToDB)();
    // await startCronJobs();
    await (0, init_1.runMigrations)();
    const app = (0, express_1.default)();
    app.disable('x-powered-by');
    app.use(config_1.default.MiddleWare.allowedMethods);
    app.use((0, cors_1.default)({
        credentials: true,
        origin: process.env.FRONTEND_URL,
    }));
    app.use(body_parser_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.get('/', (_, res) => {
        res.send(`${process.env.APP_NAME} server is running`);
    });
    // init api routes
    app.use('/api/auth', api_1.default.AuthApi);
    app.use('/api/cex', config_1.default.MiddleWare.authenticateUser, api_1.default.CexApi);
    app.use('/api/dex', config_1.default.MiddleWare.authenticateUser, api_1.default.DexApi);
    app.use('/api/info', config_1.default.MiddleWare.authenticateUser, api_1.default.InfoApi);
    // start
    const port = process.env.PORT;
    app.listen(port, () => {
        config_1.default.Logger.info(`App listening at http://localhost:${port}`);
    });
};
boot();
