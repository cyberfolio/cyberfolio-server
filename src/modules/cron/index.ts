import cron from 'node-cron';

import AppUtils from '@utils/index';
import removeScamTokens from './scam-tokens/remove';
import dexAssetsUpdate from './dex-assets-update';
import updateCurrencies from './update-currencies';
import cexAssetsUpdate from './cex-assets-update';

const ever2HourCronValue = '0 0 */2 * * *';
const everHourCronValue = '0 0 */1 * * *';
const everyMinuteCronValue = '0 */1 * * * *';

const path = AppUtils.getFilePath(__filename);

const initCronJobs = async () => {
  cron.schedule(ever2HourCronValue, async () => {
    try {
      await updateCurrencies();
    } catch (e) {
      if (e instanceof Error) {
        AppUtils.logError({ path, func: initCronJobs.name, e });
      } else {
        AppUtils.logError({ e: 'unknown error', path, func: initCronJobs.name });
      }
    }
  });

  cron.schedule(everHourCronValue, async () => {
    try {
      await cexAssetsUpdate.updateCexAssets();
      await dexAssetsUpdate.updateEvmAssets();
    } catch (e) {
      if (e instanceof Error) {
        AppUtils.logError({ path, func: initCronJobs.name, e });
      } else {
        AppUtils.logError({ e: 'unknown error', path, func: initCronJobs.name });
      }
    }
  });

  cron.schedule(everyMinuteCronValue, async () => {
    try {
      await removeScamTokens();
    } catch (e) {
      if (e instanceof Error) {
        AppUtils.logError({ path, func: initCronJobs.name, e });
      } else {
        AppUtils.logError({ e: 'unknown error', path, func: initCronJobs.name });
      }
    }
  });
};

export default initCronJobs;
