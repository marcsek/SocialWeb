const jwt = require("jsonwebtoken");
require("dotenv").config();

const signJwtToken = (userID, expireTime) => {
  let token = jwt.sign({ id: userID }, process.env.TOKEN_SECRET, { expiresIn: expireTime });
  return token;
};

module.exports.signJwtToken = signJwtToken;
