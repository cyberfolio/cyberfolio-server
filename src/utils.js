const Web3 = require("web3");
const ethers = require("ethers");
const { v4: uuidv4 } = require("uuid");
const { default: axios } = require("axios");

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

const formatBalance = (balance, decimals) => {
  return ethers.utils.formatUnits(balance, parseInt(decimals));
};

const sathoshiToBtcBalance = (satoshi) => {
  return satoshi * 0.00000001;
};

const toBase64 = (string) => {
  return Buffer.from(string).toString("base64");
};

const intDivide = (numerator, denominator) => {
  return parseInt((numerator / denominator).toString().split(".")[0]);
};

const generateNonce = () => {
  return `I confirm that I'm the owner of this wallet by signing this message: ${uuidv4()}`;
};

const deleteMongoVersionAndId = (object) => {
  const clone = JSON.parse(JSON.stringify(object));
  if (clone) {
    Object.keys(clone).forEach(function (key) {
      key.indexOf("_") == 0 && delete clone[key];
    });
    return clone;
  }
  return null;
};

const doesImageExists = async (url) => {
  try {
    await axios({
      url,
      method: "get",
    });
    return true;
  } catch (e) {
    return false;
  }
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const roundNumber = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

module.exports = {
  sleep,
  isValid0xAddress,
  formatBalance,
  sathoshiToBtcBalance,
  toBase64,
  intDivide,
  generateNonce,
  deleteMongoVersionAndId,
  doesImageExists,
  capitalizeFirstLetter,
  roundNumber,
};
