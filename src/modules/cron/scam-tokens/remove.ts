import { logError, getFilePath } from "@src/utils";
import dexRepository from "@src/api/dex/repository";
import { dexAssetModel } from "@src/api/dex/repository/models";
import axios from "axios";
import { EvmWithChain } from "@constants/index";
import { scamTokenModel } from "./model";

const path = getFilePath(__filename);

interface ScamToken {
  address: string;
  chainId: string;
}
interface ScamTokenResponse {
  name: string;
  description: number;
  updated: number;
  tokens: ScamToken[];
}

export const removeScamTokens = async () => {
  try {
    const assets = await dexRepository.getAllAssets();
    const scam = await axios.get<ScamTokenResponse>(
      "https://raw.githubusercontent.com/dappradar/tokens-blacklist/main/all-tokens.json",
    );
    const scamTokens = scam?.data?.tokens;
    if (Array.isArray(scam.data?.tokens)) {
      scamTokens.forEach(async ({ address, chainId }) => {
        await scamTokenModel.findOneAndUpdate(
          {
            $or: [{ address: address.toLowerCase() }, { address }],
            $and: [
              {
                chainId,
              },
            ],
          },
          {
            address: address.toLowerCase(),
            chainId,
          },
          { upsert: true },
        );
      });
    }
    for (const asset of assets) {
      const isScamToken = scamTokens.find(
        (scamToken) =>
          scamToken.address.toLowerCase() === asset.contractAddress.toLowerCase() &&
          scamToken.chainId === EvmWithChain[asset.chain].chainId,
      );
      if (isScamToken) {
        try {
          await dexAssetModel.deleteMany({ contractAddress: asset.contractAddress });
        } catch (e) {
          logError({
            func: removeScamTokens.name,
            path,
            e,
          });
        }
      }
    }
  } catch (e) {
    logError({
      func: removeScamTokens.name,
      path,
      e,
    });
    throw e;
  }
};
