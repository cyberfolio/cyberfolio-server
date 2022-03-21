const mongoose = require("mongoose");

const cexSchema = mongoose.Schema({
  keyIdentifier: String,
  apiKey: String,
  apiSecret: String,
  cexName: String,
});
const cexModel = mongoose.model("cex", cexSchema);

module.exports = {
  cexModel,
};
