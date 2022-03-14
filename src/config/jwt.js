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

const verifyJwtAndReturnUser = ({ jwtToken }) => {
  try {
    const result = jwt.verify(jwtToken, process.env.JWT_SECRET);
    return result;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  signJwt,
  verifyJwtAndReturnUser,
};
