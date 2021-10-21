const { ApiPromise, WsProvider } = require("@polkadot/api");

const getTokenBalances = async (walletAddress) => {
  try {
    const wsProvider = new WsProvider("wss://rpc.polkadot.io");
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

    const { data: balance } = await api.query.system.account(walletAddress);
    const formattedBalance = balance.free / 10000000000;
    return {
      balance: formattedBalance,
    };
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getTokenBalances,
};
