const app = require("../server");
const io = app.get("io");

const moment = require("moment");

const RoomModel = require("../mongoModels/chatRoom");
const { addUser, getUser, userLeave, getUsers } = require("../utils/hanleUsers");

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ name, room, id, last }, callback) => {
    if (!name || !room || !id) {
      return callback("Bad parameters");
    }
    addUser(socket.id, id, name, room);

    if (last) {
      socket.leave(last);
      socket.broadcast.to(last).emit("alertMessage", {
        message: name + " stopped viewing chat",
      });
    }

    socket.join(room);
    socket.emit("allertMessage", {
      message: "Welcome " + name,
    });

    socket.broadcast.to(room).emit("allertMessage", {
      message: name + " started viewing chat",
    });

    socket.on("disconnect", () => {
      const leaver = userLeave(socket.id);
      if (!leaver) return;

      socket.broadcast.to(leaver.room).emit("allertMessage", {
        message: leaver.name + " stopped viewing chat",
      });
    });

    socket.on("chatMessage", async (msg) => {
      const currentUser = getUser(socket.id);
      console.log(msg);
      if (!currentUser) {
        console.log("No user");
        return;
      }

      let date = moment().format("ll") + " " + moment().format("LT");
      date = date.split(" ");
      date.splice(2, 1);
      date = date.join(" ");

      try {
        const update = await RoomModel.collection.updateOne(
          { id: currentUser.room },
          {
            $push: {
              messages: {
                msg: msg,
                name: currentUser.name,
                id: currentUser.id,
                time: date,
              },
            },
          }
        );
        if (update.modifiedCount === 0) {
          return callback("Message lost");
        }
        io.to(currentUser.room).emit("message", {
          msg: msg,
          name: currentUser.name,
          time: date,
          id: currentUser.id,
        });
      } catch (error) {
        return callback("Error " + error);
      }
    });

    return callback("Succesful connection");
  });
});

module.exports = this;
