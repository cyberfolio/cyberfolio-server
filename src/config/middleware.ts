import express from 'express';

import { getUserByEvmAddress } from '@api/auth/repository';
import AppStructures from '@structures/index';
import jwt from './jwt';

const allowedMethods = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // NOTE: Exclude TRACE and TRACK methods to avoid XST attacks.
  const allowedMethods = ['OPTIONS', 'HEAD', 'CONNECT', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).send(`${req.method} not allowed.`);
  }
  next();
};

const authenticateUser = async (
  req: AppStructures.AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction,
  // eslint-disable-next-line consistent-return
) => {
  const jwtToken = req.cookies?.token;
  if (!jwtToken) {
    return res.status(401).send('Token could not be found');
  }
  try {
    const jwtPayload = jwt.verifyJwtAndReturnUserEvmAddress({ jwtToken });
    if (typeof jwtPayload?.evmAddress !== 'string') {
      return res.status(500).send('Unexpected error occured');
    }
    const userInDb = await getUserByEvmAddress({
      evmAddress: jwtPayload.evmAddress,
    });
    req.user = userInDb;
    if (!userInDb) {
      return res.status(401).send('User not found');
    }
    next();
  } catch (e) {
    res.clearCookie('token');
    res.status(401).send('Unauthenticated');
  }
};

const MiddleWare = {
  allowedMethods,
  authenticateUser,
};

export default MiddleWare;
