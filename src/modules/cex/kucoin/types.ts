interface Asset {
  id: string;
  currency: string;
  type: string;
  balance: string;
  available: string;
  holds: string;
}

// https://docs.kucoin.com/#list-accounts
export interface KucoinAccountsApiResponse {
  data: Asset[];
}
