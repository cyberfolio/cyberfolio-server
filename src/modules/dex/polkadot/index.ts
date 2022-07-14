import { Chain } from '@config/types';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { getFilePath, logError } from '@src/utils';

const path = getFilePath(__filename);

const getTokenBalances = async (walletAddress: string) => {
  try {
    const wsProvider = new WsProvider(`${process.env.POLKADOT_WEBSOCKET_URL}`);
    const api = await ApiPromise.create({
      provider: wsProvider,
      typesAlias: {
        assets: {
          Balance: 'u64',
        },
      },
      types: {
        AssetDetails: {
          supply: 'Balance',
        },
      },
    });
    const decimals = Number(process.env.POLKADOT_DECIMALS);

    const { data: balance } = await api.query.system.account(walletAddress);
    const free = Number(balance.free);

    const formattedFreeBalance = free / decimals;
    // const formattedReservedBalance = balance.reserved / decimals;
    return [
      {
        name: 'Polkadot',
        price: 25,
        symbol: 'dot',
        balance: formattedFreeBalance,
        chain: Chain.POLKADOT,
        scan: '',
      },
    ];
  } catch (e) {
    logError({
      e,
      func: getTokenBalances.name,
      path,
    });
    throw e;
  }
};

const polkadot = {
  getTokenBalances,
};

export default polkadot;
