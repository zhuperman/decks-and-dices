function Player(username, socketId) {
  this.username = username;
  this.roomId = "";
  this.socketId = socketId;
}

module.exports = Player;
