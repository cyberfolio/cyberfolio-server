import Web3 from "web3";
import ethers from "ethers";
import { v4 as uuidv4 } from "uuid";
import { default as axios } from "axios";

export const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`
  )
);

export const sleep = require("timers/promises").setTimeout;

export const isValid0xAddress = (address: string) => {
  return web3.utils.isAddress(address);
};

export const formatBalance = (balance: string, decimals: string) => {
  return ethers.utils.formatUnits(balance, parseInt(decimals));
};

export const sathoshiToBtcBalance = (satoshi: number) => {
  return satoshi * 0.00000001;
};

export const toBase64 = (string: string) => {
  return Buffer.from(string).toString("base64");
};

export const intDivide = (numerator: number, denominator: number) => {
  return parseInt((numerator / denominator).toString().split(".")[0]);
};

export const generateNonce = () => {
  return `I confirm that I'm the owner of this wallet by signing this message: ${uuidv4()}`;
};

export const deleteMongoVersionAndId = (object: any) => {
  const clone = JSON.parse(JSON.stringify(object));
  if (clone) {
    Object.keys(clone).forEach(function (key) {
      key.indexOf("_") == 0 && delete clone[key];
    });
    return clone;
  }
  return null;
};

export const doesImageExists = async (url: string) => {
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

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const roundNumber = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};
