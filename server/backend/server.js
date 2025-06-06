const express = require("express");
const chats = require("../data/data");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoute = require("../routes/userRoutes");
const chatRoute = require("../routes/chatRoute");
const messageRoute = require("../routes/messageRoute");
const path = require("path");
const {
  notFound,
  errorHandler,
} = require("../backend/middleware/errorMiddleWare");

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  console.log("Received a GET request on /");
  res.send("Hello from server!");
});

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

///
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", () => {
    res.send("Api is running successfully");
  });
}
///
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.port || 5001;
const server = app.listen(PORT, () =>
  console.log(`"listening on port ${PORT}"`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
