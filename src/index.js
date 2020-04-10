// Dependancies
const path = require("path");
const http = require("http");
const express = require("express");

// Websocket library
const socketio = require("socket.io");

// Profanity filter
const Filter = require("bad-words");


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

  // Log the new connection
  console.log("New socket connection");

  // Server -> Single connected
  socket.emit("message", "Welcome!");

  // Server -> All active connections except the current one
  socket.broadcast.emit("message", "A new user has joined");

  // Server -> All active connections
  socket.on("sendMessage", (msg, callback) => {

    // Filter language
    const filter = new Filter();
    if (filter.isProfane(msg)) {
      return callback("Profanity is not allowed");
    }

    // Send message to every available clients, and execute supplied callback
    io.emit("message", msg);
    callback();

  });

  // Recieve latitude and longitude from client,
  //  then publish location to all clients
  socket.on("sendLocation", (coords, callback) => {
    io.emit("locationMessage",
      "https://google.com/maps?q=" + coords.latitude + "," + coords.longitude);
    callback();
  });

  // Send client disconnect to every available clients
  socket.on("disconnect", () => {
    io.emit("message", "A user has left")
    console.log();
  });

})

// Launch server with port from env file
const port = process.env.PORT;
server.listen(port, () => {
  console.log("Server started on port " + port);
});
