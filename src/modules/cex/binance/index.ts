import axios, { AxiosError } from "axios";
import crypto from "crypto-js";

import { roundNumber } from "@src/utils";
import { getCurrentUSDPrice, getFullNameOfTheCurrency, getContractAddress } from "@providers/coingecko";
import { getCryptoCurrencyLogo } from "@providers/coinmarketcap";
import { BinanceError, CexAssetResponse, CexName } from "@config/types";

const API_URL = process.env.BINANCE_API_URL;

const getAssets = async ({ apiKey, apiSecret }: { apiKey: string; apiSecret: string }): Promise<CexAssetResponse[]> => {
  const queryString = `timestamp=${Date.now()}`;
  const signature = crypto.HmacSHA256(queryString, apiSecret).toString(crypto.enc.Hex);
  try {
    const accountInfo = (await axios({
      url: `${API_URL}/api/v3/account?${queryString}&signature=${signature}`,
      method: "get",
      headers: {
        "X-MBX-APIKEY": apiKey,
      },
    })) as any;
    const balances = accountInfo?.data?.balances?.filter((balance: any) => {
      if (Number(balance.free) > 0) {
        return balance;
      }
    });

    const response: CexAssetResponse[] = [];
    if (Array.isArray(balances) && balances.length > 0) {
      for (let i = 0; i < balances.length; i++) {
        const symbol = balances[i].asset?.toLowerCase();
        const price = await getCurrentUSDPrice(symbol);
        const name = await getFullNameOfTheCurrency(symbol);
        const contractAddress = await getContractAddress(symbol);
        const value = roundNumber(parseFloat(balances[i].free) * price);
        const logo = await getCryptoCurrencyLogo({
          symbol,
        });
        if (value > 1) {
          response.push({
            name,
            symbol,
            contractAddress,
            balance: parseFloat(balances[i].free),
            price,
            value,
            logo,
            cexName: CexName.BINANCE,
          });
        }
      }
    }
    return response;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const binanceError = e as AxiosError<BinanceError>;
      if (binanceError.response?.data?.code === -1022) {
        throw new Error("API Secret is invalid");
      }
      if (binanceError.response?.data?.code === -2015) {
        throw new Error("API key is invalid or IP restricted or permissions are missing");
      } else if (binanceError.response?.data?.msg) {
        throw new Error(binanceError.response.data.msg);
      } else {
        throw new Error(e.message);
      }
    } else {
      throw e;
    }
  }
};

const getFiatDepositAndWithDrawalHistory = async ({
  transactionType,
  apiKey,
  apiSecret,
}: {
  transactionType: string;
  apiKey: string;
  apiSecret: string;
}) => {
  const queryString = `transactionType=${transactionType}&timestamp=${Date.now()}`;
  const signature = crypto.HmacSHA256(queryString, apiSecret).toString(crypto.enc.Hex);
  try {
    const response = await axios({
      url: `${API_URL}/sapi/v1/fiat/orders?${queryString}&signature=${signature}`,
      method: "get",
      headers: {
        "X-MBX-APIKEY": apiKey,
      },
    });

    const data = response.data;
    return data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const binanceError = e as AxiosError<BinanceError>;
      if (binanceError.response?.data?.msg) {
        throw new Error(binanceError.response.data.msg);
      } else {
        throw new Error(e.message);
      }
    } else {
      throw e;
    }
  }
};

const getFiatPaymentBuyAndSellHistory = async ({
  transactionType,
  apiKey,
  apiSecret,
}: {
  transactionType: string;
  apiKey: string;
  apiSecret: string;
}) => {
  const queryString = `transactionType=${transactionType}&timestamp=${Date.now()}`;
  const signature = crypto.HmacSHA256(queryString, apiSecret).toString(crypto.enc.Hex);
  try {
    const response = await axios({
      url: `${API_URL}/sapi/v1/fiat/payments?${queryString}&signature=${signature}`,
      method: "get",
      headers: {
        "X-MBX-APIKEY": apiKey,
      },
    });

    const data = response.data;
    return data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const binanceError = e as AxiosError<BinanceError>;
      if (binanceError.response?.data?.msg) {
        throw new Error(binanceError.response.data.msg);
      } else {
        throw new Error(e.message);
      }
    } else {
      throw e;
    }
  }
};

export default {
  getAssets,
  getFiatDepositAndWithDrawalHistory,
  getFiatPaymentBuyAndSellHistory,
};
