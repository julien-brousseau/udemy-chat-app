// Dependancies
const path = require("path");
const http = require("http");
const express = require("express");

// Websocket library
const socketio = require("socket.io");

// Profanity filter
const Filter = require("bad-words");

// Messages tools
const { generateMessage, generateLocationMessage } = require("./utils/messages")

// Users tools
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users")

// Create server
const app = express();

// Allow the use of the websocket library
const server = http.createServer(app);

// Initialize socketIO
const io = socketio(server);

// Set Public path
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));


// Listen for connections
io.on("connection", (socket) => {

  // Join room command
  socket.on("join", ({ username, room }, callback) => {

    // Add user and store the error or the user object
    // Socket.id is the automatically generated ID
    const { error, user } = addUser({ id: socket.id, username, room })

    // Send back error if failed
    if (error) return callback(error);

    // Sends event to clients
    socket.join(user.room);

    // Send welcome message to current client
    socket.emit("message", {text: "Welcome!"});

    // Send a message to every available clients, except the current one
    socket.broadcast.to(user.room).emit("message",
      generateMessage("Admin", `${user.username} has joined`));

    // Send user list to clients for update
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room)
    })

    // Let client know the join is successful
    callback()

  });

  // Send message to chat toom
  socket.on("sendMessage", (message, callback) => {

    // Get current client user data
    const user = getUser(socket.id);

    // Filter language
    const filter = new Filter();
    if (filter.isProfane(message.text)) {
      return callback("Profanity is not allowed");
    }

    // Send message to every available clients, and execute supplied callback
    io.to(user.room).emit("message",
      generateMessage(user.username, message));
    callback();

  });

  // Recieve latitude and longitude from client, then publish location to all clients
  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("locationMessage",
      generateLocationMessage(user.username, coords));
    callback();
  });

  // Send client disconnect to every available clients
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", generateMessage("Admin", `${user.username} has left`));
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });

})


// Launch server with port from env file
const port = process.env.PORT;
server.listen(port, () => {
  console.log("Server started on port " + port);
});
