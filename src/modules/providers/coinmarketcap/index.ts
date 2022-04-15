import axios from "axios";

const apiKey = process.env.COINMARKETCAP_API_KEY as string;
export const getCryptoCurrencyLogo = async ({ symbol }: { symbol: string }) => {
  try {
    const response = (await axios.request({
      url: `${process.env.COINMARKETCAP_API_URL}/cryptocurrency/info?symbol=${symbol}`,
      method: "get",
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
      },
    })) as any;

    if (Array.isArray(response?.data?.data[symbol.toUpperCase()])) {
      return response?.data?.data[symbol.toUpperCase()][0]?.logo;
    }
    return response?.data?.data?.logo;
  } catch (e) {
    // console.log(e.message);
  }
};
