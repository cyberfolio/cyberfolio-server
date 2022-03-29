const cron = require("node-cron");
const { updateCurrencies } = require("./updateCurrencies");

const everyHourCronValue = "0 0 */1 * * *";

const initCronJobs = () => {
  cron.schedule(everyHourCronValue, async () => {
    console.log("Running cryptoprice update at: " + new Date());
    try {
      await updateCurrencies();
      console.log("Cryptoprice update completed at: " + new Date());
    } catch (e) {
      console.log("Cryptoprice update failed at, reason: " + e.message);
    }
    console.log(" ");
  });
};

module.exports = {
  initCronJobs,
};
