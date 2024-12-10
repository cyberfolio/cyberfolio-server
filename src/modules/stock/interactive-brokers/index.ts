import axios from 'axios';
import { getFilePath, logError } from '@src/utils';

const path = getFilePath(__filename);

const getStocks = async (walletAddress: string) => {
  try {
    const response = await axios.get(`${process.env.INTERACTIVE_BROKERS_API_URL}/api/stocks/${walletAddress}`);
    return response;
  } catch (e) {
    logError({
      e,
      func: getStocks.name,
      path,
    });
    throw e;
  }
};

const interactiveBrokers = {
  getStocks,
};

export default interactiveBrokers;
