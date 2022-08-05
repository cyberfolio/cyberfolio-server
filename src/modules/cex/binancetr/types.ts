interface AccountAsset {
  free: string;
  locked: string;
  asset: string;
}
enum AccountType {
  SPOT = 'SPOT',
  MARGIN = 'MARGIN',
}
interface Data {
  accountAssets: AccountAsset[];
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
// https://binance-docs.github.io/apidocs/spot/en/#query-open-oco-user_data
export interface BinanceTRAccountAPIResponse {
  code: number;
  msg: string;
  data: Data;
  timeStamp: number;
}
