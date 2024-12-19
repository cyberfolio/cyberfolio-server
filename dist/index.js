"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
require("dotenv-safe/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("@config/logger"));
const auth_1 = __importDefault(require("./api/auth"));
const dex_1 = __importDefault(require("./api/dex"));
const cex_1 = __importDefault(require("./api/cex"));
const info_1 = __importDefault(require("./api/info"));
const init_1 = require("./init");
const middleware_1 = require("./config/middleware");
const boot = async () => {
    await (0, init_1.connectToDB)();
    // await startCronJobs();
    await (0, init_1.runMigrations)();
    const app = (0, express_1.default)();
    app.disable('x-powered-by');
    app.use(middleware_1.allowedMethods);
    app.use((0, cors_1.default)({
        credentials: true,
        origin: process.env.FRONTEND_URL,
    }));
    app.use(body_parser_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.get('/', (_, res) => {
        res.send('Alive');
    });
    // init api routes
    app.use('/api/auth', auth_1.default);
    app.use('/api/cex', middleware_1.authenticateUser, cex_1.default);
    app.use('/api/dex', middleware_1.authenticateUser, dex_1.default);
    app.use('/api/info', middleware_1.authenticateUser, info_1.default);
    // start
    const port = process.env.PORT;
    app.listen(port, () => {
        logger_1.default.info(`App listening at http://localhost:${port}`);
    });
};
boot();
