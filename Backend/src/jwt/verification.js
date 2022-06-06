const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const token = req.header("authtoken");
  if (!token) {
    return res.status(400).send("No JWT found");
  }

  try {
    const verified = jwt.decode(token, "JE_TO_JEDNO");
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).send("Something went wrong with JWT token");
  }
};

module.exports.verifyJWT = verifyJWT;
