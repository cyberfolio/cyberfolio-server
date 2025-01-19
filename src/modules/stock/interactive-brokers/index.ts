import axios from 'axios';
import AppUtils from '@src/utils';

const path = AppUtils.getFilePath(__filename);

const getStocks = async (walletAddress: string) => {
  try {
    const response = await axios.get(`${process.env.INTERACTIVE_BROKERS_API_URL}/api/stocks/${walletAddress}`);
    return response;
  } catch (e) {
    AppUtils.logError({
      e,
      func: getStocks.name,
      path,
    });
    throw e;
  }
};

const InteractiveBrokers = {
  getStocks,
};

export default InteractiveBrokers;
