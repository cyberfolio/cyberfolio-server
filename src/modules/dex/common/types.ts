import { Chain } from "@config/types";

export interface CovalentTokenBalanceItems {
  contract_decimals: string;
  contract_name: string;
  contract_ticker_symbol: string | null;
  contract_address: string;
  logo_url: string;
  last_transferred_at: string;
  type: string;
  balance: string;
  balance_24h: string;
  quote_rate: number | null;
  quote: number;
}

export interface CovalentTokenBalanceResponse {
  data: {
    address: string;
    updated_at: string;
    next_update_at: string;
    quote_currency: string;
    chain_id: number;
    items: CovalentTokenBalanceItems[];
  };
}

export interface DexAssetAPIResponse {
  name: string;
  symbol: string;
  contractAddress: string;
  logo: string | undefined;
  balance: number;
  price: number;
  value: number;
  chain: Chain;
  scan: string;
}
