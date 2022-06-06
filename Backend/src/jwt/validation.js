const jwt = require("jsonwebtoken");
require("dotenv").config();

const validate = (req, res, next) => {
  const token = req.header("authtoken");
  if (!token) return res.status(404).send("not logged in");

  try {
    const verified = jwt.decode(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(404).send("invalid token");
  }
};

module.exports = validate;
