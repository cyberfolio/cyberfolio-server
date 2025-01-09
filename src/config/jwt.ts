import AppUtils from '@src/utils';
import jwt from 'jsonwebtoken';
import { JwtTokenInterface } from './types';

const secret = process.env.JWT_SECRET as jwt.Secret;
const jwtExpiryInDays = Number(process.env.JWT_EXPIRY_IN_DAYS);

const signJwt = (evmAddress: string) => {
  if (evmAddress && process.env.JWT_SECRET) {
    const token = jwt.sign({ evmAddress }, secret, {
      expiresIn: `${jwtExpiryInDays}d`,
    });
    return token;
  }
  throw new Error('Please provide user');
};

const verifyJwtAndReturnUserEvmAddress = ({ jwtToken }: { jwtToken: string }) => {
  try {
    const result = jwt.verify(jwtToken, secret) as JwtTokenInterface;
    return result;
  } catch (e) {
    const error = AppUtils.onError(e);
    throw error;
  }
};

export default {
  signJwt,
  verifyJwtAndReturnUserEvmAddress,
};
