import axios, { AxiosError } from "axios";
import crypto from "crypto-js";

import { roundNumber } from "@src/utils";
import coinmarketcapProvider from "@providers/coinmarketcap";
import { FTXError, CexName, CexAssetResponse } from "@config/types";
import { FTXAllBalancesAPIResponse } from "./types";

const API_URL = process.env.FTX_API_URL;

const getAssets = async ({ apiKey, apiSecret }: { apiKey: string; apiSecret: string }): Promise<CexAssetResponse[]> => {
  const timestamp = Date.now();
  const signatureString = `${timestamp}GET/api/wallet/all_balances`;
  const signature = crypto.HmacSHA256(signatureString, apiSecret).toString(crypto.enc.Hex);
  try {
    // https://docs.ftx.com/#get-balances-of-all-accounts
    const allBalances = await axios.get<FTXAllBalancesAPIResponse>(`${API_URL}/wallet/all_balances`, {
      headers: {
        "FTX-KEY": apiKey,
        "FTX-TS": timestamp.toString(),
        "FTX-SIGN": signature,
      },
    });
    const balances = allBalances?.data?.result?.main?.filter((balance) => {
      if (Number(balance.usdValue) > 1) {
        return balance;
      }
    });

    const response = [];
    if (Array.isArray(balances) && balances.length > 0) {
      for (let i = 0; i < balances.length; i++) {
        const balance = roundNumber(balances[i].total);
        const symbol = balances[i].coin?.toLowerCase();
        const price = balances[i].usdValue / balances[i].total;
        const name = balances[i].coin;
        const value = roundNumber(balances[i].usdValue);
        let logo = await coinmarketcapProvider.getCryptoCurrencyLogo({
          symbol,
        });
        if (symbol === "usd") {
          logo = "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Dollar-USD-icon.png";
        }
        if (value > 1) {
          response.push({
            name,
            symbol,
            balance,
            contractAddress: "",
            price,
            value,
            logo,
            cexName: CexName.FTX,
            accountName: CexName.FTX,
          });
        }
      }
    }
    return response;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const ftxError = e as AxiosError<FTXError>;
      if (ftxError.response?.data?.error === "Not logged in: Invalid API key" && ftxError.response?.status === 401) {
        throw new Error("Your API Key is invalid");
      } else if (
        ftxError.response?.data?.error === "Not logged in: Invalid signature" &&
        ftxError.response?.status === 401
      ) {
        throw new Error("Your API Secret is invalid");
      } else {
        throw new Error(ftxError.message);
      }
    } else {
      throw e;
    }
  }
};

export default {
  getAssets,
};
