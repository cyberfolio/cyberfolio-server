"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = exports.startCronJobs = exports.connectToDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cron_1 = __importDefault(require("./modules/cron"));
const migrations_1 = __importDefault(require("./migrations"));
const config_1 = __importDefault(require("./config"));
const connectToDB = async () => {
    try {
        config_1.default.Logger.info('Conntecting to Mongodb...');
        await mongoose_1.default.connect(`${process.env.MONGO_URL}`);
        config_1.default.Logger.info('Successfully connected to Mongodb');
    }
    catch (e) {
        config_1.default.Logger.error(`Error at src/init.ts ${exports.connectToDB.name}`, e);
        process.exit(1);
    }
};
exports.connectToDB = connectToDB;
const startCronJobs = async () => {
    try {
        await (0, cron_1.default)();
    }
    catch (e) {
        config_1.default.Logger.error(`Error at src/init.ts ${exports.startCronJobs.name}`);
        process.exit(1);
    }
};
exports.startCronJobs = startCronJobs;
const runMigrations = async () => {
    try {
        await (0, migrations_1.default)();
    }
    catch (e) {
        config_1.default.Logger.error(`Error at src/init.ts ${exports.startCronJobs.name}`);
        process.exit(1);
    }
};
exports.runMigrations = runMigrations;
