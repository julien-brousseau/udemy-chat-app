// Websocket object
const socket = io();

// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocation = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;


// Server responses

// Client recieves the server event sent with socket.emit()
socket.on("message", (message) => {

  // Render the Mustache template with properties
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("H:mm")
  });

  // Insert added html into the div
  $messages.insertAdjacentHTML("beforeend", html);

});

// Server location link
socket.on("locationMessage", (message) => {
    const html = Mustache.render(locationTemplate, {
      url: message.url,
      createdAt: moment(message.createdAt).format("H:mm")
    });
    $messages.insertAdjacentHTML("beforeend", html);
});


// --- HTML events ---

// Attach emit event to the form submit
$messageForm.addEventListener("submit", (e) => {

  e.preventDefault();

  // Disable the form buttons, and wait for the enable command from server
  $messageFormButton.setAttribute("disabled", "disabled");

  // Send a message via the server, and process response
  const msg = e.target.elements.message.value;
  socket.emit("sendMessage", msg, (error) => {

    // Reset form
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    // Process response
    if (error) {
      return console.log(error);
    }
    console.log("Message delivered");

  });
})

// Share geolocalisation
$sendLocation.addEventListener("click", () => {

  // Disable the button
  $sendLocation.setAttribute("disabled", "disabled");

  // No browser support
  if (!navigator.geolocation) return alert("Unable to access geolocation");

  // Send latitude and longitude to server
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit("sendLocation", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude

    // Process response
    }, (error) => {

      // Re-enable the button
      $sendLocation.removeAttribute("disabled");

      console.log("Location shared");
    })
  });

});
