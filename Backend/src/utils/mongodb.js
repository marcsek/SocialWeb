const mongoose = require("mongoose");
require("dotenv").config();

const makeConnection = () => {
  mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("connected to mongoose");
  });
};

module.exports.makeConnection = makeConnection;
