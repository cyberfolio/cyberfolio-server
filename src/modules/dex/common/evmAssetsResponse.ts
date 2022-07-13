import { formatBalance, getFilePath, isScamToken, logError } from "@src/utils";
import { getCurrencyLogo } from "@providers/coingecko/repository";
import { Chain, ScanURL } from "@config/types";
import { EvmWithChain } from "@constants/index";
import { CovalentTokenBalanceItems, DexAssetAPIResponse } from "./types";

const path = getFilePath(__filename);

const evmAssetsResponse = async (
  walletAddress: string,
  scanURL: ScanURL,
  assets: CovalentTokenBalanceItems[],
  chain: Chain,
) => {
  const response: DexAssetAPIResponse[] = [];
  if (assets && Array.isArray(assets)) {
    for (let i = 0; i < assets.length; i++) {
      try {
        const contractAddress = assets[i].contract_address?.toLowerCase();
        const chainId = EvmWithChain[chain].chainId;
        const isScam = await isScamToken(contractAddress, chainId);

        if (parseInt(assets[i].balance) > 0) {
          let balance = Number(formatBalance(assets[i].balance, assets[i].contract_decimals));
          if (contractAddress === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
            balance = parseFloat(balance.toFixed(5));
          } else {
            balance = parseFloat(balance.toFixed(3));
          }

          const name = assets[i].contract_name;
          const price = assets[i].quote_rate;
          if (price === null) {
            continue;
          }
          const value = balance * price;
          const symbol = assets[i].contract_ticker_symbol?.toLowerCase();
          const logo = symbol ? await getCurrencyLogo(symbol) : "";
          let scan = "";
          if (scanURL === ScanURL.SOLANA && contractAddress !== "11111111111111111111111111111111") {
            scan = `${scanURL}/address/${walletAddress}/tokens`;
          } else if (scanURL === ScanURL.SOLANA && contractAddress === "11111111111111111111111111111111") {
            scan = `${scanURL}/address/${walletAddress}`;
          } else if (contractAddress && contractAddress !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
            scan = `${scanURL}/token/${contractAddress}?a=${walletAddress}`;
          } else {
            scan = `${scanURL}/address/${walletAddress}`;
          }
          if (symbol?.toLowerCase() === "uni-v2" || price > 200000 || balance === 0) {
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
              chain,
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
