interface Balances {
  free: string;
  locked: string;
  asset: string;
}
enum AccountType {
  SPOT = 'SPOT',
  MARGIN = 'MARGIN',
}

export enum TransactionType {
  DEPOSIT = '0',
  WITHDRAW = '1',
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

interface BinanceFiatPaymentData {
  orderNo: string;
  sourceAmount: string; // Fiat trade amount
  fiatCurrency: string; // Fiat token
  obtainAmount: string; // Crypto trade amount
  cryptoCurrency: string; // Crypto token
  totalFee: string; // Trade fee
  price: string;
  status: string; // Processing, Completed, Failed, Refunded
  paymentMethod: string;
  createTime: number;
  updateTime: number;
}

interface BinanceFiatDepositData {
  orderNo: string;
  fiatCurrency: string;
  indicatedAmount: string;
  amount: string;
  totalFee: string; // Trade fee
  method: string; // Trade method
  status: string; // Processing, Failed, Successful, Finished, Refunding, Refunded, Refund Failed, Order Partial credit Stopped
  createTime: 1626144956000;
  updateTime: 1626400907000;
}

export interface BinanceFiatPaymentAPIResponse {
  code: string;
  message: string;
  data: BinanceFiatPaymentData[];
  total: number;
  success: boolean;
}

export interface BinanceFiatDepositAPIResponse {
  code: string;
  message: string;
  data: BinanceFiatDepositData[];
  total: number;
  success: boolean;
}
