// Websocket object
const socket = io();

// Client recieves the server event sent with socket.emit()
socket.on("message", (m) => {
  console.log(m);
});

// Attach emit event to the form submit
document.querySelector("#message-form").addEventListener("submit", (e) => {

  // Prevent submitting
  e.preventDefault();

  // Message value
  const msg = e.target.elements.message.value;

  //
  socket.emit("sendMessage", msg, (error) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message delivered");
  });
})

// Share geolocalisation
document.querySelector("#send-location").addEventListener("click", () => {

  // No browser support
  if (!navigator.geolocation) {
    return alert("Unable to access geolocation");
  }

  // Send latitude and longitude to server
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit("sendLocation", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude

    // Callback from server
    }, (location, error) => {
      console.log("Location shared");
    })
  });

});
