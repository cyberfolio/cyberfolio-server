import axios from "axios";
import { getFilePath, logError } from "@src/utils";
import evmAssetsResponse from "@dex/common/evmAssetsResponse";
import { Platform, ScanURL } from "@config/types";

const path = getFilePath(__filename);

export const getTokenBalances = async (walletAddress: string) => {
  try {
    const walletInfo = (await axios({
      url: `${process.env.COVALENT_V1_API_URL}/${process.env.AVALANCHE_CCHAIN_ID}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`,
      method: "get",
    })) as any;
    const assets = walletInfo?.data?.data?.items;
    const response = await evmAssetsResponse(walletAddress, ScanURL.AVALANCHE, assets, Platform.AVALANCHE);
    return response;
  } catch (e) {
    logError({
      e,
      func: getTokenBalances.name,
      path,
    });
    throw e;
  }
};
