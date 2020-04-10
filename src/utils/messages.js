//
const generateMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime()
  };
};

//
const generateLocationMessage = (coords) => {
  const gMapUrl = "https://google.com/maps?q="
  return {
    url: gMapUrl + coords.latitude + "," + coords.longitude,
    createdAt: new Date().getTime()
  };
};


module.exports = {
  generateMessage,
  generateLocationMessage
};
