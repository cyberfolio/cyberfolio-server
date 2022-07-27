import { CexName, Chain } from '@config/types';

export interface ConnectedWallets {
  chain: Chain;
  name: string;
  address: string;
  scan: string;
  netWorth: number;
}

export interface ConnectedCexes {
  name: CexName;
  netWorth: number;
}

export interface ConnectedAccountsResponse {
  cexes: ConnectedCexes[];
  wallets: ConnectedWallets[];
}
