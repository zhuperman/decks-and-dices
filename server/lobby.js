function Lobby() {
  this.players = [];
  this.rooms = [];
}

Lobby.prototype.addPlayer = function(player) {
  if (!this.players.find(p => p.username == player.username)) this.players.push(player);
};

Lobby.prototype.removePlayer = function(player) {
  this.players = this.players.filter(p => p.username != player.username);
};

Lobby.prototype.getPlayer = function(username) {
  return this.players.find(p => p.username == username);
};

Lobby.prototype.getPlayers = function() {
  return this.players;
};

Lobby.prototype.addRoom = function(room) {
  this.rooms.push(room);
};

Lobby.prototype.removeRoom = function(id) {
  this.rooms = this.rooms.filter(room => room.id != id);
};

Lobby.prototype.getRoom = function(id) {
  return this.rooms.find(room => room.id == id);
};

Lobby.prototype.getRooms = function() {
  return this.rooms;
};

module.exports = Lobby;
