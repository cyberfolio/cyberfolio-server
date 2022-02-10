const jwt = require("jsonwebtoken");

const signJwt = (user) => {
  if (user && process.env.JWT_SECRET) {
    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    return token;
  } else {
    throw new Error("Please provide user");
  }
};

const verifyJwt = (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    throw new Error("Unauthenticated");
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    res.clearCookie("jwt");
    throw new Error("Unauthenticated");
  }
};

module.exports = {
  signJwt,
  verifyJwt,
};
