// https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyInfo
export interface CoinMCapCryptocurrencyInfoAPIResponse {
  data: {
    [key: string]: {
      logo: string;
      name: string;
      symbol: string;
      category: string;
    };
  };
}
