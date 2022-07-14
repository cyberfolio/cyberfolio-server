interface Balances {
  free: string;
  locked: string;
  asset: string;
}
enum AccountType {
  SPOT = "SPOT",
  MARGIN = "MARGIN",
}
// https://binance-docs.github.io/apidocs/spot/en/#query-open-oco-user_data
export interface BinanceAccountAPIResponse {
  balances: Balances[];
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: number;
  accountType: AccountType;
  permissions: [AccountType];
}
