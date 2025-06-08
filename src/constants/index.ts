import AppStructures from '@structures/index';

interface PlatformName {
  name: AppStructures.Platform;
  evmChainId?: string; // Optional for non-EVM chains
}

interface IPlatformNames {
  [key: string]: PlatformName;
}

const PlatformNames: IPlatformNames = {
  Bitcoin: {
    name: AppStructures.Platform.BITCOIN,
  },
  Solana: {
    name: AppStructures.Platform.SOLANA,
  },
  Polkadot: {
    name: AppStructures.Platform.POLKADOT,
  },
  Binance: {
    name: AppStructures.Platform.BINANCE,
  },
  Gateio: {
    name: AppStructures.Platform.GATEIO,
  },
  Kucoin: {
    name: AppStructures.Platform.KUCOIN,
  },
  Ethereum: {
    name: AppStructures.Platform.ETHEREUM,
    evmChainId: '1',
  },
  SmartChain: {
    name: AppStructures.Platform.BSC,
    evmChainId: '56',
  },
  Avalanche: {
    name: AppStructures.Platform.AVALANCHE,
    evmChainId: '43114',
  },
  Polygon: {
    name: AppStructures.Platform.POLYGON,
    evmChainId: '137',
  },
  Arbitrum: {
    name: AppStructures.Platform.ARBITRUM,
    evmChainId: '42161',
  },
  Optimism: {
    name: AppStructures.Platform.OPTIMISM,
    evmChainId: '10',
  },
};

const ChainIDs = {
  AVALANCHE_CCHAIN: 43114,
  SMARTCHAIN: 56,
  POLYGON: 137,
  ETHEREUM: 1,
  ARBITRUM: 42161,
  OPTIMISM: 10,
};

const ScamTokens = [
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0x949E0a0672299E6fcD6bec3Bd1735d6647b20618',
  },
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0x1495279E3AA643aC139167014CBAfa99E29C6199',
  },
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0x7e6202903275772044198D07b8A536cc064f8480',
  },
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0x53f952260518bffc4F803DF125ff22799DEbec1A',
  },
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0x119e2ad8f0c85c6f61afdf0df69693028cdc10be',
  },
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0xbc6675de91e3da8eac51293ecb87c359019621cf',
  },
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0x373233a38ae21cf0c4f9de11570e7d5aa6824a1e',
  },
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0xbc6675de91e3da8eac51293ecb87c359019621cf',
  },
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0xd5e3bf9045cfb1e6ded4b35d1b9c34be16d6eec3',
  },
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0x27b880865395da6cda9c407e5edfcc32184cf429',
  },
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0x0df62d2cd80591798721ddc93001afe868c367ff',
  },
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0x2ba6204c23fbd5698ed90abc911de263e5f41266',
  },
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0xd35f9ab96d04adb02fd549ef6a576ce4e2c1d935',
  },
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0x556798dd55db12562a6950ea8339a273539b0495',
  },
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0x5190b01965b6e3d786706fd4a999978626c19880',
  },
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0x8ee3e98dcced9f5d3df5287272f0b2d301d97c57',
  },
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0xd22202d23fe7de9e3dbe11a2a88f42f4cb9507cf',
  },
  {
    chain: AppStructures.Chain.BSC,
    contractAddress: '0xb8a9704d48c3e3817cc17bc6d350b00d7caaecf6',
  },
  {
    chain: AppStructures.Chain.POLYGON,
    contractAddress: '0xe4fb1bb8423417a460286b0ed44b64e104c5fae5',
  },
  {
    chain: AppStructures.Chain.POLYGON,
    contractAddress: '0x2744861accb5bd435017c1cfee789b6ebab42082',
  },
  {
    chain: AppStructures.Chain.POLYGON,
    contractAddress: '0x81067076dcb7d3168ccf7036117b9d72051205e2',
  },
  {
    chain: AppStructures.Chain.POLYGON,
    contractAddress: '0x95e9464b5cc3bf81210259812b51665a437aa11b',
  },
  {
    chain: AppStructures.Chain.POLYGON,
    contractAddress: '0x0b91b07beb67333225a5ba0259d55aee10e3a578',
  },

  {
    chain: AppStructures.Chain.ETHEREUM,
    contractAddress: '0x82dfdb2ec1aa6003ed4acba663403d7c2127ff67',
  },
];

const AppConstants = {
  PlatformNames,
  ChainIDs,
  ScamTokens,
};

export default AppConstants;
