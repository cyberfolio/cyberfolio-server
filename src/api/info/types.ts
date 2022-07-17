import { CexName, Chain } from '@config/types';

export interface ConnectedWallets {
  chain: Chain;
  walletName: string;
  walletAddress: string;
}

export interface ConnectedAccountsResponse {
  cexes: CexName[];
  wallets: ConnectedWallets[];
}
