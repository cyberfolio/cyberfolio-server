import { ApiClient, SpotApi } from "gate-api";

import { getCurrentUSDPrice, getFullNameOfTheCurrency, getContractAddress } from "@providers/coingecko";
import { getCryptoCurrencyLogo } from "@providers/coinmarketcap";
import axios, { AxiosError } from "axios";
import { GateIoError } from "@config/custom-typings";
import { Platform } from "@config/types";

export const getAssets = async ({ apiKey, apiSecret }: { apiKey: string; apiSecret: string }) => {
  const client = new ApiClient();
  client.setApiKeySecret(apiKey, apiSecret);

  const spotApi = new SpotApi(client);
  try {
    const accounts = await spotApi.listSpotAccounts({ currency: undefined });

    const data = accounts?.body;
    const response = [];

    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const available = data[i].available;
        const locked = data[i].locked;
        let balance = parseFloat(available ? available : "0");
        const lockedBalance = parseFloat(locked ? locked : "0");

        if (balance > 0.5 || lockedBalance > 0.5) {
          const symbol = String(data[i]?.currency).toLowerCase();
          const name = await getFullNameOfTheCurrency(symbol);
          const contractAddress = await getContractAddress(symbol);
          balance = balance + lockedBalance;
          const price = await getCurrentUSDPrice(symbol);
          const value = balance * price;
          const logo = await getCryptoCurrencyLogo({
            symbol,
          });
          if (value > 1) {
            response.push({
              name,
              symbol,
              type: "cryptocurrency",
              contractAddress,
              balance,
              price,
              value,
              logo,
              cexName: Platform.GATEIO,
            });
          }
        }
      }
    }

    return response;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const gateIoError = e as AxiosError<GateIoError>;
      if (gateIoError.response?.data?.code) {
        throw new Error(gateIoError.response.data.code);
      } else {
        throw new Error(e.message);
      }
    } else {
      throw e;
    }
  }
};
