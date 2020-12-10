function Player() {
  this.username = "";
  this.roomId = "";
  this.socketId = "";
}

Player.prototype.setUsername = function(username) {
  this.username = username;
};

Player.prototype.getUsername = function() {
  return this.username;
};

Player.prototype.joinRoom = function(roomId) {
  this.roomId = roomId;
};

Player.prototype.leaveRoom = function() {
  this.roomId = "";
};

Player.prototype.getRoom = function() {
  return this.roomId;
};

Player.prototype.setConnection = function(socketId) {
  this.socketId = socketId;
};

Player.prototype.getConnection = function() {
  return this.socketId;
};

module.exports = Player;
