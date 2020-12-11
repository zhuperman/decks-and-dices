function Lobby() {
  this.players = [];
  this.rooms = [];
}

Lobby.prototype.addPlayer = function(player) {
  if (!this.players.find(p => p.username == player.username)) this.players.push(player);
};

Lobby.prototype.removePlayer = function(username) {
  this.players = this.players.filter(p => p.username != username);
};

Lobby.prototype.getPlayer = function(username) {
  return this.players.find(p => p.username == username);
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

module.exports = Lobby;
