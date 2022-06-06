const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../jwt/verification");
const UserModel = require("../mongoModels/user");
const RoomModel = require("../mongoModels/chatRoom");

router.post("/joinNewRoom", verifyJWT, async (req, res) => {
  if (!req.body.roomToJoin) {
    return res.status(400).send("No room specified");
  }

  try {
    const roomToJoin = await RoomModel.findOne({ id: req.body.roomToJoin }).exec();
    if (!roomToJoin) {
      return res.status(404).send("Room not found");
    }

    if (await roomToJoin.users.find((e) => e == req.user.id)) {
      return res.status(409).send("Room alredy joined");
    }

    const updateOne = await RoomModel.updateOne(
      {
        id: roomToJoin.id,
      },
      {
        $push: {
          users: req.user.id,
        },
      }
    );

    const updateTwo = await UserModel.updateOne(
      {
        id: req.user.id,
      },
      {
        $push: {
          rooms: roomToJoin.id,
        },
      }
    );
    if (updateOne.modifiedCount === 0 || updateTwo.modifiedCount === 0) {
      return res.status(409).send("Could not join room");
    }
    res.status(201).send("Joined room");
  } catch (err) {
    res.status(500).send("Error: " + error);
  }
});

router.post("/createRoom", verifyJWT, async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send("No room name specified");
  }

  try {
    const room = new RoomModel({ name: req.body.name });
    const newRoom = await room.save();

    if (!newRoom) {
      return res.status(500).send("Could not create new room");
    }

    const update = await UserModel.updateOne(
      {
        id: req.user.id,
      },
      {
        $push: {
          rooms: newRoom.id,
        },
      }
    );

    if (update.modifiedCount === 0) {
      return res.status(409).send("Could not create room");
    }
    res.status(201).send("Created room");
  } catch (err) {
    res.status(500).send("Error: " + error);
  }
});

router.post("/loadRooms", verifyJWT, async (req, res) => {
  if (!req.body.roomsToLoad) {
    return res.status(400).send("No rooms specified");
  }
  try {
    const foundRooms = await RoomModel.find({
      id: { $in: req.body.roomsToLoad },
    }).exec();

    if (!foundRooms) {
      return res.status(409).send("Could not find room");
    }
    const badIds = req.body.roomsToLoad.length - foundRooms.length;

    const roomMap = foundRooms.map((room) => {
      return {
        name: room.name,
        id: room.id,
      };
    });
    res.status(200).send({ badIds: badIds, rooms: roomMap });
  } catch (err) {
    res.status(500).send("Error: " + error);
  }
});

router.post("/getRoomContent", verifyJWT, async (req, res) => {
  if (!req.body.roomToLoad) {
    return res.status(400).send("No room specified");
  }
  try {
    const room = await RoomModel.findOne({ id: req.body.roomToLoad }).exec();
    let lastIndex = 0;

    if (room.messages.length >= 20) {
      lastIndex = room.messages.length - 20;
    }

    let messagesToSend = [];

    if (room.messages.length < 20) {
      messagesToSend = room.messages.slice(lastIndex, room.messages.length);
    } else {
      messagesToSend = room.messages.slice(lastIndex, lastIndex + 20);
    }
    res.status(200).send({
      messages: messagesToSend,
      messagesLen: room.messages.length,
      users: room.users,
    });
  } catch (error) {
    res.status(500).send("Error: " + error);
  }
});

router.post("/loadMoreMsgs", verifyJWT, async (req, res) => {
  if (!req.body.roomToLoad || !req.body.index) {
    return res.status(400).send("Incorrect parameters");
  }

  try {
    const room = await RoomModel.findOne({ id: req.body.roomToLoad }).exec();
    let lastIndex = 0;

    if (room.messages.length >= req.body.index) {
      lastIndex = room.messages.length - req.body.index;
    }

    let messagesToSend = [];

    if (room.messages.length < req.body.index) {
      messagesToSend = room.messages.slice(lastIndex, room.messages.length - req.body.index + 20);
    } else {
      messagesToSend = room.messages.slice(lastIndex, lastIndex + 20);
    }

    res.status(200).send({ messages: messagesToSend });
  } catch (err) {
    res.status(500).send("Error: " + error);
  }
});

module.exports = router;
