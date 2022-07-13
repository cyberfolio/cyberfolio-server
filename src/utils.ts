/* eslint-disable promise/avoid-new */
/* eslint-disable promise/param-names */
import Web3 from "web3";
import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";
import { AxiosError, default as axios } from "axios";
import { logger } from "@config/logger";
import { scamTokenModel } from "./modules/cron/scam-tokens/model";

export const web3 = new Web3(
  new Web3.providers.HttpProvider(`${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`),
);

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

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

export const onError = (e: unknown) => {
  if (e instanceof Error) {
    throw e;
  } else {
    logger.error("Unexpected error", e);
  }
};

export const logError = ({ path, func, e }: { path: string; func: string; e: Error | unknown | AxiosError<never> }) => {
  let message;
  if (axios.isAxiosError(e)) {
    message = e.response?.data ? JSON.stringify(e.response?.data, null, 2) : e.response?.statusText;
  } else if (e instanceof Error) {
    message = e.message ? e.message : String(e);
  } else {
    message = e;
  }
  logger.error(`Error at ${path} ${func} message: ${message}`);
};

export const getFilePath = (path: string) => {
  const fileName = path.substring(path.indexOf("src"));
  return fileName;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeMongoFields = (object: any) => {
  if (!object) return object;
  delete object._id;
  delete object.__v;
  return object;
};

export const isScamToken = async (address: string, chainId: string) => {
  const isScamToken = await scamTokenModel.findOne({ address, chainId });
  return Boolean(isScamToken);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEnumOf<T>(object: T, possibleValue: any): possibleValue is T[keyof T] {
  return Object.values(object).includes(possibleValue);
}
