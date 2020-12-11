const {nanoid} = require("nanoid");
const maxPlayers = {"Chess": 2, "Checkers": 2, "Mahjong": 4, "Monopoly": 4, "Poker": 4, "Yahtzee": 8};

function Room(title, game, private) {
  this.id = nanoid();
  this.title = title;
  this.game = game;
  this.private = private;
  this.players = [];
  this.maxPlayers = maxPlayers[game];
}

Room.prototype.connectPlayer = function(player) {
  if (this.players.length < this.maxPlayers) {
    this.players.push(player);
    player.roomId = this.id;
    return true;
  }
  return false;
};

Room.prototype.disconnectPlayer = function(username) {
  this.players = this.players.filter(p => p.username != username);
  player.roomId = "";
};

Room.prototype.getPlayer = function(username) {
  return this.players.find(p => p.username == username);
};

module.exports = Room;
