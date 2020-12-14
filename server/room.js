const {nanoid} = require("nanoid");
const maxPlayers = {"Chess": 2, "Checkers": 2, "Mahjong": 4, "Monopoly": 4, "Poker": 4, "Yahtzee": 8};

function Room(title, game, private) {
  this.id = nanoid();
  this.title = title;
  this.game = game;
  this.private = private;
  this.players = [];
  this.maxPlayers = maxPlayers[game];
  this.date = Date.now();
}

Room.prototype.addPlayer = function(player) {
  if (this.players.length < this.maxPlayers) {
    this.players.push(player);
    return true;
  }
  return false;
};

Room.prototype.removePlayer = function(player) {
  this.players = this.players.filter(p => p != player);
};

Room.prototype.findPlayer = function(player) {
  return this.players.find(p => p == player);
};

module.exports = Room;
