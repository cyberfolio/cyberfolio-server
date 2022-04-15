import axios from "axios";

import { sathoshiToBtcBalance } from "@src/utils";
import { getCurrentUSDPrice } from "@providers/coingecko";

export const getBitcoinBalance = async (walletAddress: string) => {
  try {
    const { data } = (await axios({
      url: `${process.env.BLOCKCHAIN_INFO_API_URL}/q/addressbalance/${walletAddress}`,
      method: "get",
    })) as any;
    const balance = sathoshiToBtcBalance(data);
    const price = await getCurrentUSDPrice("btc");
    const value = balance * price;

    return {
      name: "Bitcoin",
      symbol: "btc",
      balance,
      price,
      logo: "https://cdn.cdnlogo.com/logos/b/46/bitcoin.svg",
      value,
      chain: "bitcoin",
    };
  } catch (e) {
    throw new Error(e);
  }
};
