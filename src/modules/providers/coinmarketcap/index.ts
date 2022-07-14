import { getFilePath, logError, sleep } from "@src/utils";
import axios from "axios";
import { CoinMCapCryptocurrencyInfoAPIResponse } from "./types";

const apiKey = process.env.COINMARKETCAP_API_KEY as string;
const path = getFilePath(__filename);

const getCryptoCurrencyLogo = async ({ symbol }: { symbol: string }): Promise<string | undefined> => {
  try {
    const response = await axios.get<CoinMCapCryptocurrencyInfoAPIResponse>(
      `${process.env.COINMARKETCAP_API_URL}/cryptocurrency/info?symbol=${symbol}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": apiKey,
        },
      },
    );
    await sleep(200);

    if (response.data.data[symbol.toUpperCase()].logo) {
      return response.data.data[symbol.toUpperCase()].logo;
    }
    return undefined;
  } catch (e) {
    logError({
      path,
      e,
      func: getCryptoCurrencyLogo.name,
    });
    return undefined;
  }
};

const coinmarketcapProider = {
  getCryptoCurrencyLogo,
};

export default coinmarketcapProider;
