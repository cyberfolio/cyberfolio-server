export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URL: string;
      PORT: string;
      FRONTEND_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRY_IN_DAYS: string;
      NODE_ENV: string;

      INFURA_API_URL: string;
      INFURA_PROJECT_ID: string;

      COINGECKO_V3_API_URL: string;

      COINMARKETCAP_API_KEY: string;
      COINMARKETCAP_API_URL: string;

      COVALENT_V1_API_URL: string;
      COVALENT_API_KEY: string;

      BLOCKCHAIN_INFO_API_URL: string;

      SOLANA_MAINNET_CHAIN_ID: string;

      BINANCE_API_URL: string;

      KUCOIN_API_VERSION: string;
      KUCOIN_API_URL: string;
    }
  }
}
