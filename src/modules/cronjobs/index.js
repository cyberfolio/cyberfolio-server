const cron = require("node-cron");
const updateCoins = require("./updateCoins");

const initCronJobs = () => {
  // every hour
  cron.schedule("0 0 */1 * * *", async () => {
    console.log("Running cryptoprice update at: " + new Date());
    try {
      await updateCoins();
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
