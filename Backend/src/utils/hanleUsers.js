const users = [];

const addUser = (socketId, id, name, room) => {
  const foundIndex = users.findIndex((user) => user.id == id);
  if (foundIndex !== -1) {
    users[foundIndex] = { socketId, id, name, room };
  } else {
    users.push({ socketId, id, name, room });
  }
};

const getUser = (id) => {
  const foundUser = users.find((user) => user.socketId == id);
  return foundUser;
};

const getUsers = () => {
  const userMap = users.map((user) => {
    return {
      user: {
        name: user.name,
        id: user._id,
      },
    };
  });

  return userMap;
};

const userLeave = (id) => {
  const foundIndex = users.findIndex((user) => user.socketId === id);
  if (foundIndex !== -1) {
    let leaver = users[foundIndex];
    users.splice(foundIndex, 1);
    return leaver;
  }
  return null;
};

module.exports = {
  addUser,
  getUser,
  getUsers,
  userLeave,
};
