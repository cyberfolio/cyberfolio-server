import Express from "express";

import { getUserByEvmAddress } from "../api/auth/repository";
import { verifyJwtAndReturnUser } from "./jwt";

export const allowedMethods = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  // NOTE: Exclude TRACE and TRACK methods to avoid XST attacks.
  const allowedMethods = ["OPTIONS", "HEAD", "CONNECT", "GET", "POST", "PUT", "DELETE", "PATCH"];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).send(`${req.method} not allowed.`);
  }
  next();
};

export const authenticateUser = async (req: any, res: Express.Response, next: Express.NextFunction) => {
  const jwtToken = req.cookies?.token;
  if (!jwtToken) {
    return res.status(401).send("Token could not be found");
  }
  try {
    const user = verifyJwtAndReturnUser({ jwtToken }) as any;
    req.keyIdentifier = user.keyIdentifier;
    const userInDb = await getUserByEvmAddress({
      evmAddress: user?.keyIdentifier,
    });
    if (!userInDb) {
      throw new Error("User not found");
    }
    next();
  } catch (e) {
    res.clearCookie("token");
    res.status(401).send(`Unauthenticated`);
  }
};
