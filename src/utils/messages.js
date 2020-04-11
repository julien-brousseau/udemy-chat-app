//
const generateMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime()
  };
};

//
const generateLocationMessage = (username, coords) => {
  const gMapUrl = "https://google.com/maps?q="
  return {
    username,
    url: gMapUrl + coords.latitude + "," + coords.longitude,
    createdAt: new Date().getTime()
  };
};


module.exports = {
  generateMessage,
  generateLocationMessage
};
