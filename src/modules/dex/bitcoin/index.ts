import axios from "axios";

import { getFilePath, logError, sathoshiToBtcBalance } from "@src/utils";
import { getCurrentUSDPrice } from "@providers/coingecko";
import { Platform } from "@config/types";

const path = getFilePath(__filename);

const getBalance = async (walletAddress: string) => {
  try {
    const { data } = await axios.get<number>(
      `${process.env.BLOCKCHAIN_INFO_API_URL}/q/addressbalance/${walletAddress}`,
    );
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
      platform: Platform.BITCOIN,
      scan: `https://www.blockchain.com/btc/address/${walletAddress}`,
    };
  } catch (e) {
    logError({
      e,
      func: getBalance.name,
      path,
    });
    throw e;
  }
};

const bitcoin = {
  getBalance,
};

export default bitcoin;
