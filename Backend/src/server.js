const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");

const mongodb = require("./utils/mongodb");
const socketio = require("socket.io");

const port = 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(session({ secret: "secret-key", resave: false, saveUninitialized: true }));
app.use("/uploads", express.static("uploads"));

const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

module.exports = app.set("io", io);

mongodb.makeConnection();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("Maturitkaformalitka API");
});

//messages socket
require("./sockets/messages");

//routes
const userRouter = require("./routes/user");
const authRoute = require("./routes/auth");
const chatRoute = require("./routes/chatRooms");

app.use("/user", userRouter);
app.use("/auth", authRoute);
app.use("/chatRooms", chatRoute);

//error handling
app.use((error, req, res, next) => {
  console.error("Error: ", error);

  res.status(500).send(error);
});

server.listen(port, () => {
  console.log(`port: ${port}`);
});
