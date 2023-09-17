/* eslint-disable no-promise-executor-return */
/* eslint-disable promise/avoid-new */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
import Web3 from 'web3';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import axios, { AxiosError } from 'axios';
import logger from '@config/logger';
import _ from 'lodash';
import { Chain, ScanURL } from '@config/types';
import scamTokenModel from './modules/cron/scam-tokens/model';

export const web3 = new Web3(
  new Web3.providers.HttpProvider(`${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`),
);

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const isValid0xAddress = (address: string) => web3.utils.isAddress(address);

export const formatBalance = (balance: string, decimals: string) => ethers.formatUnits(balance, Number(decimals));

export const sathoshiToBtcBalance = (satoshi: number) => satoshi * 0.00000001;

export const toBase64 = (string: string) => Buffer.from(string).toString('base64');

export const getScanUrl = (address: string, chain: Chain) => {
  switch (chain) {
    case Chain.ARBITRUM:
      return `${ScanURL.ARBITRUM}/address/${address}`;
    case Chain.AVALANCHE:
      return `${ScanURL.AVALANCHE}/address/${address}`;
    case Chain.BITCOIN:
      return `${ScanURL.BITCOIN}/btc/address/${address}`;
    case Chain.BSC:
      return `${ScanURL.BSC}/address/${address}`;
    case Chain.ETHEREUM:
      return `${ScanURL.ETHEREUM}/address/${address}`;
    case Chain.OPTIMISM:
      return `${ScanURL.OPTIMISM}/address/${address}`;
    case Chain.POLYGON:
      return `${ScanURL.POLYGON}/address/${address}`;
    case Chain.SOLANA:
      return `${ScanURL.SOLANA}address/${address}`;
    default:
      return '';
  }
};

export const intDivide = (numerator: number, denominator: number) =>
  Number((numerator / denominator).toString().split('.')[0]);

export const generateNonce = () => `I confirm that I'm the owner of this wallet by signing this message: ${uuidv4()}`;

export const doesImageExists = async (url: string) => {
  try {
    await axios({
      url,
      method: 'get',
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

export const roundNumber = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

export const onError = (e: unknown) => {
  let error;
  if (e instanceof Error) {
    error = e;
  } else {
    logger.error('Unexpected error', e);
    error = new Error('Unexpected error');
  }
  return error;
};

export const isEVMChain = (chain: Chain) => {
  return (
    chain === Chain.ARBITRUM ||
    chain === Chain.AVALANCHE ||
    chain === Chain.BSC ||
    chain === Chain.OPTIMISM ||
    chain === Chain.POLYGON ||
    chain === Chain.ETHEREUM
  );
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
  const fileName = path.substring(path.indexOf('src'));
  return fileName;
};

export const removeMongoFields = (object: any) => {
  if (Object.prototype.toString.call(object) !== '[object Object]') return object;
  const obj = _.cloneDeep(object);
  delete obj._id;
  delete obj.__v;
  return obj;
};

export const isScamToken = async (address: string, chainId: string) => {
  const isScam = await scamTokenModel.findOne({ address, chainId });
  return Boolean(isScam);
};

export function isEnumOf<T>(object: any, possibleValue: any): possibleValue is T[keyof T] {
  return Object.values(object).includes(possibleValue);
}

export const timestampToReadableDate = (timestamp: number) => {
  const date = new Date(timestamp);
  let month: number | string = date.getMonth() + 1;
  let day: number | string = date.getDate();
  let hour: number | string = date.getHours();
  let min: number | string = date.getMinutes();
  let sec: number | string = date.getSeconds();

  month = (month < 10 ? '0' : '') + month;
  day = (day < 10 ? '0' : '') + day;
  hour = (hour < 10 ? '0' : '') + hour;
  min = (min < 10 ? '0' : '') + min;
  sec = (sec < 10 ? '0' : '') + sec;

  const str = `${day}/${month}/${date.getFullYear()} ${hour}:${min}:${sec}`;

  return str;
};
