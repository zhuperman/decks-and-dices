const Room = require("./room");

function Lobby() {
  this.players = [];
  this.rooms = [];
  this.roomPasswords = {};
}

Lobby.prototype.addPlayer = function(player) {
  if (!this.findPlayer(player)) this.players.push(player);
};

Lobby.prototype.removePlayer = function(player) {
  this.players = this.players.filter(p => p != player);
};

Lobby.prototype.findPlayer = function(player) {
  return this.players.find(p => p == player);
};

Lobby.prototype.createRoom = function(title, game, password, player) {
  let room = new Room(title, game, password.length > 0);
  this.rooms.push(room);
  this.roomPasswords[room.id] = password;
  this.removePlayer(player);
  room.addPlayer(player);
  return room;
};

Lobby.prototype.deleteRoom = function(room) {
  this.rooms = this.rooms.filter(r => r.id != room.id);
  delete this.roomPasswords[room.id];
};

Lobby.prototype.findRoom = function(roomId) {
  return this.rooms.find(room => room.id == roomId);
};

Lobby.prototype.findPlayerRoom = function(player) {
  return this.rooms.map(room => room.findPlayer(player) ? room : null).filter(room => room != null)[0];
}

Lobby.prototype.testRoomPassword = function(room, password) {
  return password == this.roomPasswords[room.id];
};

Lobby.prototype.connectPlayerToRoom = function(room, player) {
  if (room.addPlayer(player)) {
    this.removePlayer(player);
    return true;
  }
  return false;
};

module.exports = Lobby;
