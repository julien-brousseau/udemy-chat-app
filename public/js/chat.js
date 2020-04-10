// Websocket object
const socket = io();

// Client recieves the server event sent with socket.emit()
socket.on("message", (m) => {
  console.log(m);
});

// Attach emit event to the form submit
document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.message.value;
  socket.emit("sendMessage", msg);
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
    })
  });

});
