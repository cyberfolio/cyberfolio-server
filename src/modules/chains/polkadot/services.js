const { ApiPromise, WsProvider } = require("@polkadot/api");

const getTokenBalances = async (walletAddress) => {
  try {
    const wsProvider = new WsProvider(`${process.env.POLKADOT_WEBSOCKET_URL}`);
    const api = await ApiPromise.create({
      provider: wsProvider,
      typesAlias: {
        assets: {
          Balance: "u64",
        },
      },
      types: {
        AssetDetails: {
          supply: "Balance",
        },
      },
    });
    const decimals = process.env.POLKADOT_DECIMALS;

    const { data: balance } = await api.query.system.account(walletAddress);
    const formattedFreeBalance = balance.free / decimals;
    // const formattedReservedBalance = balance.reserved / decimals;
    return [
      {
        name: "Polkadot",
        price: 25,
        symbol: "DOT",
        balance: formattedFreeBalance,
      },
    ];
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getTokenBalances,
};
