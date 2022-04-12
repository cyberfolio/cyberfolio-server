const { getUserByEvmAddress } = require("../api/auth/repository");
const { verifyJwtAndReturnUser } = require("./jwt");

const allowedMethods = (req, res, next) => {
  // NOTE: Exclude TRACE and TRACK methods to avoid XST attacks.
  const allowedMethods = [
    "OPTIONS",
    "HEAD",
    "CONNECT",
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
  ];

  if (!allowedMethods.includes(req.method)) {
    return res.status(405).send(`${req.method} not allowed.`);
  }
  next();
};

const authenticateUser = async (req, res, next) => {
  const jwtToken = req.cookies?.jwt;
  if (!jwtToken) {
    return res.status(401).send("Token could not be found");
  }
  try {
    const user = verifyJwtAndReturnUser({ jwtToken });
    req.keyIdentifier = user.keyIdentifier;
    const userInDb = await getUserByEvmAddress({
      evmAddress: user?.keyIdentifier,
    });
    if (!userInDb) {
      throw new Error("User not found");
    }
    next();
  } catch (e) {
    res.clearCookie("jwt");
    res.status(401).send(`Unauthenticated`);
  }
};

module.exports = {
  allowedMethods,
  authenticateUser,
};
