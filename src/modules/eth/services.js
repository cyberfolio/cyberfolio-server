const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`
  )
);

const isValidEthAddress = (address) => {
  return web3.utils.isAddress(address);
};

const getEthBalance = async (walletAddress) => {
  if (!walletAddress) {
    throw new Error("Please provide eth address");
  }
  if (!isValidEthAddress(walletAddress)) {
    throw new Error("Eth address is invalid");
  }
  try {
    console.log('burdayimmmm')
    const balance = await web3.eth.getBalance(walletAddress);
    return web3.utils.fromWei(balance, "ether")
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getEthBalance,
};
