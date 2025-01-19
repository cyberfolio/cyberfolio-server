import AppUtils from '@utils/index';
import { ethers } from 'ethers';
import { userModel } from './repository/models';

const path = AppUtils.getFilePath(__filename);

const checkENSName = async (keyIdentifier: string) => {
  try {
    const provider = new ethers.JsonRpcProvider(`${process.env.INFURA_API_URL}/${process.env.INFURA_PROJECT_ID}`);
    const ensName = await provider.lookupAddress(keyIdentifier);
    if (ensName) {
      await userModel.findOneAndUpdate(
        {
          keyIdentifier,
        },
        {
          ensName,
        },
      );
    }
    return ensName;
  } catch (e) {
    AppUtils.logError({
      path,
      func: checkENSName.name,
      e,
    });
    return '';
  }
};

const AuthService = {
  checkENSName,
};

export default AuthService;
