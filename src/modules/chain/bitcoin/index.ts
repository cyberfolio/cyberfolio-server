import axios from 'axios';

import AppUtils from '@utils/index';
import AppProviders from '@providers/index';
import AppStructures from '@structures/index';
import { DexAssetAPIResponse } from '@modules/chain/common/types';

const path = AppUtils.getFilePath(__filename);

const getBalance = async (walletAddress: string): Promise<DexAssetAPIResponse[]> => {
  try {
    const { data } = await axios.get<number>(
      `${process.env.BLOCKCHAIN_INFO_API_URL}/q/addressbalance/${walletAddress}`,
    );
    const balance = AppUtils.sathoshiToBtcBalance(data);
    const price = await AppProviders.Coingecko.getCurrentUSDPrice('btc');
    const value = balance * price;

    return [
      {
        name: 'Bitcoin',
        symbol: 'btc',
        balance,
        price,
        logo: 'https://cdn.cdnlogo.com/logos/b/46/bitcoin.svg',
        value,
        chain: AppStructures.Chain.BITCOIN,
        scan: `https://www.blockchain.com/btc/address/${walletAddress}`,
        contractAddress: '',
      },
    ];
  } catch (e) {
    AppUtils.logError({
      e,
      func: getBalance.name,
      path,
    });
    throw e;
  }
};

const bitcoin = {
  getBalance,
};

export default bitcoin;
