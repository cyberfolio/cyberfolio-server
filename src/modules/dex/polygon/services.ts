import axios from "axios";
import { getFilePath, logError } from "@src/utils";
import { Platform, ScanURL } from "@config/types";
import evmAssetsResponse from "@dex/common/evmAssetsResponse";

const path = getFilePath(__filename);

export const getTokenBalances = async (walletAddress: string) => {
  try {
    const walletInfo = (await axios({
      url: `${process.env.COVALENT_V1_API_URL}/${process.env.POLYGON_CHAIN_ID}/address/${walletAddress}/balances_v2/?key=${process.env.COVALENT_API_KEY}`,
      method: "get",
    })) as any;

    const assets = walletInfo?.data?.data?.items;
    const response = await evmAssetsResponse(walletAddress, ScanURL.POLYGON, assets, Platform.POLYGON);
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
