const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const { v4: uV4 } = require("uuid");

const UserModel = require("../mongoModels/user");
const { registrationVal, loginVal } = require("../utils/dataValidation");
const { signJwtToken } = require("../jwt/wrapperJwt");
const { verifyJWT } = require("../jwt/verification");

router.post("/register", async (req, res) => {
  console.log(req.body);
  const { error } = registrationVal(req.body);
  if (error) {
    return res.status(406).send(error.message);
  }

  try {
    const exists = await UserModel.findOne({ name: req.body.name });

    if (exists) {
      return res.status(409).send("Name alredy in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const userID = uV4();

    const user = new UserModel({
      name: req.body.name,
      password: hashedPassword,
      id: userID,
    });

    const newUser = await user.save();
    if (!newUser) {
      return res.status(500).send("Could not create new user");
    }

    let token = signJwtToken(userID, "30m");
    if (!token) {
      return res.status(500).send("Could not create jwt token");
    }
    return res.status(201).header("authtoken", token).json({ token: token, user: newUser });
  } catch (error) {
    res.status(500).send("Error: " + error);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginVal(req.body);
  if (error) {
    return res.status(406).send(error.message);
  }
  let user = null;
  try {
    user = await UserModel.findOne({ name: req.body.name });
    if (!user) {
      return res.status(409).send("User doesnt exist");
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(409).send("Incorrect passoword");
    }
  } catch (error) {
    res.status(500).send("Error: " + error);
  }
  let token = signJwtToken(user.id, "30m");
  if (!token) {
    return res.status(500).send("Could not create jwt token");
  }

  res.status(201).header("authtoken", token).json({ message: "Logged in user", token: token });
});

router.get("/checkToken", verifyJWT, async (req, res) => {
  try {
    const user = await UserModel.findOne({ id: req.user.id }).exec();
    if (!user) {
      return res.status(409).send("Could not find user");
    }

    res.status(200).json({
      loggedIn: true,
      user: {
        name: user.name,
        id: user.id,
        friends: user.friends,
        friendRequests: user.friendRequests,
        rooms: user.rooms,
      },
    });
  } catch (error) {
    res.status(500).send("Error: " + error);
  }
});

module.exports = router;
