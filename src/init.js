const mongoose = require("mongoose");
const { initCronJobs } = require("./modules/cronjob");

const init = async () => {
  try {
    await mongoose.connect(
      `mongodb://localhost:27017/${process.env.APP_NAME}`,
      { autoIndex: false }
    );
    initCronJobs();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

module.exports = {
  init,
};
