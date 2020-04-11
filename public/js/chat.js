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
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
// Get the current URL data using the QueryString library (loaded as script)
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

//
const autoScroll = () => {

  // Get the new message element
  const $newMsg = $messages.lastElementChild;

  // Get the height of the message + margin
  const newMsgStyles = getComputedStyle($newMsg);
  const newMessageMargin = parseInt(newMsgStyles.marginBottom)
  const newMessageHeight = $newMsg.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Messages container height
  const containerHeight = $messages.scrollHeight;

  // How far have I scrolled so far
  const scrollOffset = $messages.scrollTop + visibleHeight;

  // Check if we're scrolled down without the new message
  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }

}

// Server responses

// Client recieves the server event sent with socket.emit()
socket.on("message", (message) => {

  // Render the Mustache template with properties
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("H:mm")
  });

  // Insert added html into the div
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();

});

// Server location link
socket.on("locationMessage", (message) => {
    const html = Mustache.render(locationTemplate, {
      username: message.username,
      url: message.url,
      createdAt: moment(message.createdAt).format("H:mm")
    });
    $messages.insertAdjacentHTML("beforeend", html);
    autoScroll();
});

// Refresh users list
socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, { room, users })
  document.querySelector("#sidebar").innerHTML = html;
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

// Join a chat room, or redirect to / if incorrect data
socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error)
    location.href = "/";
  }
});
