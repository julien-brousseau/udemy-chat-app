// Dependancies
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");


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
io.on("connection", () => {
  console.log("New web socket connection");
})

// Launch server with port from env file
const port = process.env.PORT;
server.listen(port, () => {
  console.log("Server started on port " + port);
});
