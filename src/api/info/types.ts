import AppStructures from '@structures/index';

export interface ConnectedWallets {
  chain: AppStructures.Chain;
  name: string;
  address: string;
  scan: string;
  netWorth: number;
}

export interface ConnectedCexes {
  name: AppStructures.CexName;
  netWorth: number;
}

export interface ConnectedAccountsResponse {
  cexes: ConnectedCexes[];
  wallets: ConnectedWallets[];
}
