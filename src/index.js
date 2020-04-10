// Dependancies
const path = require("path");
const express = require("express");

// Create server
const app = express();

// Set Public path
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

// Launch server with port from env file
const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server started on port " + port);
});
