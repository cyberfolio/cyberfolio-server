import { formatBalance, getFilePath, isScamToken, logError } from "@src/utils";
import { getCurrencyLogo } from "@providers/coingecko/repository";
import { Platform, ScanURL } from "@config/types";
import { EvmWithChain } from "@src/modules/common";

const path = getFilePath(__filename);

const evmAssetsResponse = async (walletAddress: string, scanURL: ScanURL, assets: any, platform: Platform) => {
  const response = [];
  if (assets && Array.isArray(assets)) {
    for (let i = 0; i < assets.length; i++) {
      try {
        const contractAddress = assets[i].contract_address.toLowerCase();
        const chainId = EvmWithChain[platform].chainId;
        const isScam = await isScamToken(contractAddress, chainId);

        if (assets[i].balance > 0) {
          const balance = Number(
            parseFloat(formatBalance(assets[i].balance, parseInt(assets[i].contract_decimals) as any))?.toFixed(2),
          );

          const name = assets[i].contract_name;
          const price = assets[i]?.quote_rate;
          const value = balance * assets[i]?.quote_rate;
          const symbol = assets[i].contract_ticker_symbol?.toLowerCase();
          const logo = await getCurrencyLogo(symbol);
          const contractAddress = assets[i].contract_address;
          let scan = "";
          if (contractAddress && contractAddress !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
            scan = `${scanURL}/token/${contractAddress}?a=${walletAddress}`;
          } else {
            scan = `${scanURL}/address/${walletAddress}`;
          }
          if (symbol.toLowerCase() === "uni-v2" || price > 200000) {
            continue;
          }

          if (price && symbol && !isScam) {
            response.push({
              name,
              symbol,
              contractAddress,
              logo,
              balance,
              price,
              value,
              platform,
              scan,
            });
          }
        }
      } catch (e) {
        logError({
          e,
          func: evmAssetsResponse.name,
          path,
        });
        throw e;
      }
    }
  }
  return response;
};

export default evmAssetsResponse;
