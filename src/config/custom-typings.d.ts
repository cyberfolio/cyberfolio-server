declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_URL: string
    PORT: number
    FRONTEND_URL: string
    JWT_SECRET: string
    JWT_EXPIRY_IN_DAYS: string
    NODE_ENV: string

    INFURA_API_URL: string
    INFURA_PROJECT_ID: string

    COINGECKO_V3_API_URL: string
    COINGECKO_ERC20_TOKEN_LIST_URL: string

    COINMARKETCAP_API_KEY: string
    COINMARKETCAP_API_URL: string

    COVALENT_V1_API_URL: string
    COVALENT_API_KEY: string

    BLOCKCHAIN_INFO_API_URL: string

    AVALANCHE_CCHAIN_ID: number
    SMARTCHAIN_CHAIN_ID: number
    POLYGON_CHAIN_ID: number
    ETHEREUM_MAINNET_CHAIN_ID: number
    ARBITRUM_MAINNET_CHAIN_ID: number
    OPTIMISM_MAINNET_CHAIN_ID: number

    SOLANA_ENVIRONMET: string
    SOLANA_RPC_ENDPOINT: string
    SOLANA_DECIMALS: number

    POLKADOT_WEBSOCKET_URL: string
    POLKADOT_DECIMALS: number

    BINANCE_API_URL: string

    KUCOIN_API_VERSION: string
    KUCOIN_API_URL: string

    GATEIO_API_HOST: string
    GATEIO_API_PREFIX: string
  }

  export interface Process {
    env: ProcessEnv
  }
}
