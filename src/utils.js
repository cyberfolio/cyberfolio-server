const Web3 = require("web3");

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`
  )
);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const isValid0xAddress = (address) => {
  return web3.utils.isAddress(address);
};

const formatBalance = (balance) => {
  return web3.utils.fromWei(balance, "ether");
};

module.exports = {
  sleep,
  isValid0xAddress,
  formatBalance,
};
