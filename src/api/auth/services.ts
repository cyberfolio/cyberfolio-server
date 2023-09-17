import { getFilePath, logError } from '@src/utils';
import { ethers } from 'ethers';
import { userModel } from './repository/models';

const path = getFilePath(__filename);

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
    logError({
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
