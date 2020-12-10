const {nanoid} = require("nanoid");

function Room() {
  this.id = nanoid();
  this.title = "";
  this.players = [];
  this.maxPlayers = 4;
}

Room.prototype.setTitle = function(title) {
  this.title = title;
};

Room.prototype.getTitle = function() {
  return this.title;
};

Room.prototype.addPlayer = function(player) {
  if (this.players.length < this.maxPlayers) {
    this.players.push(player);
    player.joinRoom(this.id);
  }
};

Room.prototype.removePlayer = function(player) {
  this.players = this.players.filter(p => p != player);
  player.leaveRoom(this.id);
};

module.exports = Room;