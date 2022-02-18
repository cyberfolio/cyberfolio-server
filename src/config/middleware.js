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
    res.status(405).send(`${req.method} not allowed.`);
  }
  next();
};

const authenticateUser = (req, res, next) => {
  const jwt = req.cookies?.jwt;
  if (!jwt) {
    throw new Error("Unauthenticated");
  }
  try {
    const user = verifyJwtAndReturnUser(jwt);
    req.keyIdentifier = user.keyIdentifier;
    next();
  } catch (e) {
    res.clearCookie("jwt");
    throw new Error("Unauthenticated");
  }
};

module.exports = {
  allowedMethods,
  authenticateUser,
};
