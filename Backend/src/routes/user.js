const express = require("express");
const router = express.Router();

const { v4: uV4 } = require("uuid");

const UserModel = require("../mongoModels/user");
const { verifyJWT } = require("../jwt/verification");
const { updateVal } = require("../utils/dataValidation");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/");
  },
  filename: (req, file, callback) => {
    const imgID = uV4();
    const extArray = file.mimetype.split("/");
    const extension = extArray[extArray.length - 1];
    callback(null, `${imgID}~${new Date().getTime()}.${extension}`);
  },
});
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const fileFilter = (req, file, callback) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 26_214_400, //25MB
  },
  fileFilter: fileFilter,
});

router.post("/findOne", async (req, res) => {
  if (!req.body.id) {
    return res.status(400).send("No id specified");
  }

  try {
    const foundUser = await UserModel.findOne({ id: req.body.id }).exec();
    if (!foundUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).json({ user: foundUser });
  } catch (error) {
    res.status(500).send("Error: " + error);
  }
});

router.post("/findMany", async (req, res) => {
  if (!req.body.ids) {
    return res.status(400).send("No ids specified");
  }
  try {
    const foundUsers = await UserModel.find({ id: { $in: req.body.ids } }).exec();
    if (foundUsers.length == 0) {
      return res.status(404).send("No user found");
    }
    const badIds = req.body.ids.length - foundUsers.length;
    res.status(200).json({ badIds: badIds, users: foundUsers });
  } catch (error) {
    res.status(500).send("Error: " + error);
  }
});

router.put("/update", [upload.single("profileImg"), verifyJWT], async (req, res) => {
  const { error } = updateVal(req.body);
  if (error) {
    return res.status(406).send(error.message);
  }
  try {
    const userNow = await UserModel.findOne({ id: req.user.id }).exec();
    if (!userNow) {
      return res.status("404").send("Could not find user");
    }

    if (req.file && userNow.profileImg !== "uploads\\default.png") {
      await unlinkAsync(userNow.profileImg);
    }

    let updatedUser = {};
    if (req.file && "name" in req.body) {
      updatedUser = { name: req.body.name, profileImg: req.file.path };
    } else if ("name" in req.body) {
      updatedUser = { name: req.body.name };
    } else if (req.file) {
      updatedUser = { profileImg: req.file.path };
    }

    const update = await UserModel.collection.updateOne(
      {
        id: req.user.id,
      },
      {
        $set: updatedUser,
      }
    );
    if (update.modifiedCount === 0) {
      return res.status(409).send("Could not update user");
    }
    res.status(200).send("User updated");
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

router.post("/sendFriendRequest", verifyJWT, async (req, res) => {
  let sender = null;
  let receiver = null;

  if (!req.body.receiverId) {
    return res.status(400).send("No receiver id specified");
  }

  try {
    sender = await UserModel.findOne({ id: req.user.id }).exec();
    receiver = await UserModel.findOne({ id: req.body.receiverId }).exec();
    if (!sender || !receiver) {
      return res.status(404).send("User not found");
    }

    if ((await sender.friends.find((e) => e == receiver.id)) || (await receiver.friends.find((e) => e == sender.id))) {
      return res.status(409).send("Users are alredy friends");
    }

    if (await receiver.friendRequest.find((e) => e == sender.id)) {
      return res.status(409).send("Request alredy sent");
    }

    if (await sender.friendRequest.find((e) => e == receiver.id)) {
      const makeOutcome = await makeFriends(sender, receiver);
      if (!makeOutcome) {
        return res.status(409).send("Could not make friends");
      }
      return res.status(201).send("Made friends");
    }
    const updateOutcome = await UserModel.collection.updateOne(
      { id: receiver.id },
      {
        $set: { friendRequest: sender.id },
      }
    );

    if (updateOutcome.modifiedCount === 0) {
      return res.status(409).send("Could not make friends");
    }
    res.status(201).send("Friendrequest sent");
  } catch (error) {
    return res.status(500).send("Error: " + error);
  }
});

router.post("/acceptFriendRequest", verifyJWT, async (req, res) => {
  let accepter = null;
  let requester = null;

  if (!req.body.requesterId) {
    return res.status(400).send("No receiver id specified");
  }

  try {
    accepter = await UserModel.findOne({ id: req.user.id }).exec();
    requester = await UserModel.findOne({ id: req.body.requesterId }).exec();
    if (!accepter || !requester) {
      return res.status(404).send("User not found");
    }

    const makeOutcome = await makeFriends(accepter, requester);
    if (!makeOutcome) {
      return res.status(409).send("Could not make friends");
    }
    res.status(201).json({ message: "Made friends", friend: requester });
  } catch (error) {
    return res.status(500).send("Error: " + error);
  }
});

const makeFriends = async (sender, receiver) => {
  try {
    const updateOne = await UserModel.collection.updateOne(
      { id: sender.id },
      {
        $set: {
          friends: receiver.id,
          friendRequest: receiver.friendRequest.filter((f) => {
            return f !== receiver.id;
          }),
        },
      }
    );
    const updateTwo = await UserModel.collection.updateOne(
      { id: receiver.id },
      {
        $set: {
          friends: sender.id,
          friendRequest: receiver.friendRequest.filter((f) => {
            return f !== sender.id;
          }),
        },
      }
    );

    if (updateOne.modifiedCount === 0 || updateTwo.modifiedCount === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = router;
