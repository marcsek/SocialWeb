const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      max: 32,
      min: 3,
    },
    password: {
      type: String,
      required: true,
      max: 64,
      min: 8,
    },
    id: {
      type: String,
      require: true,
    },
    rooms: {
      type: Array,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    friends: {
      type: Array,
    },
    friendRequest: {
      type: Array,
    },
    description: {
      type: String,
    },
    profileImg: {
      type: String,
      required: true,
      default: "uploads\\default.png",
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("user", userSchema);
