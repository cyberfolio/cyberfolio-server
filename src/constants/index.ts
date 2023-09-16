import { Platform } from '@config/types';

const EvmWithChain = {
  Bitcoin: {
    name: Platform.BITCOIN,
    chainId: '-1',
  },
  Solana: {
    name: Platform.SOLANA,
    chainId: '-1',
  },
  Polkadot: {
    name: Platform.POLKADOT,
    chainId: '-1',
  },
  Binance: {
    name: Platform.BINANCE,
    chainId: '-1',
  },
  Gateio: {
    name: Platform.GATEIO,
    chainId: '-1',
  },
  Kucoin: {
    name: Platform.KUCOIN,
    chainId: '-1',
  },
  Ethereum: {
    name: Platform.ETHEREUM,
    chainId: '1',
  },
  SmartChain: {
    name: Platform.BSC,
    chainId: '56',
  },
  Avalanche: {
    name: Platform.AVALANCHE,
    chainId: '43114',
  },
  Polygon: {
    name: Platform.POLYGON,
    chainId: '137',
  },
  Arbitrum: {
    name: Platform.ARBITRUM,
    chainId: '42161',
  },
  Optimism: {
    name: Platform.OPTIMISM,
    chainId: '10',
  },
};

const constants = {
  EvmWithChain,
};

export default constants;
