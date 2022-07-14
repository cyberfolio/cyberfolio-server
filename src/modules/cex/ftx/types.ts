interface Balance {
  coin: string;
  free: number;
  spotBorrow: number;
  total: number;
  usdValue: number;
  availableWithoutBorrow: number;
}

export interface FTXAllBalancesAPIResponse {
  success: boolean;
  result: {
    main: Balance[];
    'Battle Royale': Balance[];
  };
}
