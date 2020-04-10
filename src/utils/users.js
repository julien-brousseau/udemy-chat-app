// List of users
const users = [];

// Add a user
const addUser = ({ id, username, room }) => {

  // Clean and validate username and room
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!username || !room) return { error: "Invalid user or room data" };

  // Check for name uniqueness
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  })
  if (existingUser) return { error: "Username is already used" }

  // Store user and return it
  const user = { id, username, room };
  users.push(user);

  return { user }

}

// Remove a user
const removeUser = (id) => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
}

// Get user by id
const getUser = (id) => {
  return users.find(user => user.id === id);
}

// Get all users in room
const getUsersInRoom = (room) => {
  return users.filter(user => user.room === room);
}


module.exports = { addUser, removeUser, getUser, getUsersInRoom }
