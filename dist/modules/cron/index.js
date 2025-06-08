"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const index_1 = __importDefault(require("@utils/index"));
const remove_1 = __importDefault(require("./scam-tokens/remove"));
const dex_assets_update_1 = __importDefault(require("./dex-assets-update"));
const update_currencies_1 = __importDefault(require("./update-currencies"));
const cex_assets_update_1 = __importDefault(require("./cex-assets-update"));
const ever2HourCronValue = '0 0 */2 * * *';
const everHourCronValue = '0 0 */1 * * *';
const everyMinuteCronValue = '0 */1 * * * *';
const path = index_1.default.getFilePath(__filename);
const initCronJobs = async () => {
    node_cron_1.default.schedule(ever2HourCronValue, async () => {
        try {
            await (0, update_currencies_1.default)();
        }
        catch (e) {
            if (e instanceof Error) {
                index_1.default.logError({ path, func: initCronJobs.name, e });
            }
            else {
                index_1.default.logError({ e: 'unknown error', path, func: initCronJobs.name });
            }
        }
    });
    node_cron_1.default.schedule(everHourCronValue, async () => {
        try {
            await cex_assets_update_1.default.updateCexAssets();
            await dex_assets_update_1.default.updateEvmAssets();
        }
        catch (e) {
            if (e instanceof Error) {
                index_1.default.logError({ path, func: initCronJobs.name, e });
            }
            else {
                index_1.default.logError({ e: 'unknown error', path, func: initCronJobs.name });
            }
        }
    });
    node_cron_1.default.schedule(everyMinuteCronValue, async () => {
        try {
            await (0, remove_1.default)();
        }
        catch (e) {
            if (e instanceof Error) {
                index_1.default.logError({ path, func: initCronJobs.name, e });
            }
            else {
                index_1.default.logError({ e: 'unknown error', path, func: initCronJobs.name });
            }
        }
    });
};
exports.default = initCronJobs;
