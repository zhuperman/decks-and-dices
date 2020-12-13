const Lobby = require("./lobby");
const http = require("http");
const PORT = 3001;
const express = require("express");
const app = express();
const server = http.createServer(app);
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const io = socketIo(server);
const expressSession = require("express-session");
const socketSession = require("express-socket.io-session");
const crypto = require("crypto");
const dataStore = require("nedb");
const nedbStore = require("nedb-session-store")(expressSession);
const sessionStore = new nedbStore({filename: "db/sessions.db"});
const session = expressSession({
  secret: "zhuperman",
  resave: false,
  saveUninitialized: false,
  store: sessionStore
});

let lobby = new Lobby();
let users = new dataStore({filename: "db/users.db", autoload: true, timestampData: true});

lobby.createRoom("Let's Play Checkers!", "Checkers", "", "Server Bot");
lobby.createRoom("Let's Play Chess!", "Chess", "", "Server Bot");
lobby.createRoom("Let's Play Poker!", "Poker", "", "Server Bot");
lobby.createRoom("Let's Play Yahtzee!", "Yahtzee", "", "Server Bot");
lobby.createRoom("Let's Play Monopoly!", "Monopoly", "", "Server Bot");
lobby.createRoom("Let's Play Mahjong!", "Mahjong", "", "Server Bot");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session);
io.use(socketSession(session, {
  autoSave: true
}));

app.use(function(req, res, next) {
  console.log("HTTP Request:", req.sessionID + ":" + req.session.username, req.method, req.url, req.body);
  next();
});

app.post("/register", function(req, res, next) {
  let username = req.body.username;
  let usernameLowerCase = username.toLowerCase();
  let password = req.body.password;
  let email = req.body.email.toLowerCase();
  let salt = crypto.randomBytes(16).toString("base64");
  let hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  let saltedHash = hash.digest("base64");
  users.findOne({usernameLowerCase: usernameLowerCase}, (err, user) => {
    if (err) return res.status(500).json({status: err});
    if (user) return res.status(409).json({status: "The username you entered is already registered."});
    users.findOne({email: email}, (err, user) => {
      if (err) return res.status(500).json({status: err});
      if (user) return res.status(409).json({status: "The email you entered is already registered."});
      users.update({username: username}, {username, usernameLowerCase, salt, saltedHash, email}, {upsert: true}, err => {
        if (err) return res.status(500).json({status: err});
        req.session.username = username;
        return res.json({status: "Registration Successful."});
      });
    });
  });
});

app.post("/login", function(req, res, next) {
  let username = req.body.username.toLowerCase();
  let password = req.body.password;
  users.findOne({usernameLowerCase: username}, function(err, user) {
    if (err) return res.status(500).json({status: err});
    if (!user) return res.status(401).json({status: "The username and password you entered did not match our records."});
    let salt = user.salt;
    let hash = crypto.createHmac("sha512", salt);
    hash.update(password);
    let saltedHash = hash.digest("base64");
    if (user.saltedHash !== saltedHash) return res.status(401).json({status: "The username and password you entered did not match our records."});
    req.session.username = user.username;
    return res.json({status: "Login Successful."});
  });
});

app.post("/logout", function(req, res, next) {
  req.session.destroy(err => {
    return err ? res.json({status: "Logout Unsuccessful."}) : res.json({status: "Logout Successful."});
  });
});

io.sockets.on("connection", function(socket) {

  socket.onAny(function(event, ...args) {
    console.log("Socket Event:", socket.handshake.sessionID + ":" + socket.handshake.session.username, event);
  });

  let isAuthenticated = function() {
    if (!socket.handshake.session.username) {
      socket.emit("authenticationRequired", {status: "You do not have permission to perform this request."});
      return false;
    }
    return true;
  };

  let onDisconnect = function() {
    let player = socket.handshake.session.username;
    if (!player) return;
    let room = lobby.findRoom(socket.handshake.session.roomId);
    if (room) {
      room.removePlayer(player);
      socket.leave(room.id);
      socket.to(room.id).emit("roomUpdate", {status: player + " has left the room.", room: room});
      if (room.players.length == 0) lobby.deleteRoom(room);
      delete socket.handshake.session.roomId;
    }
    lobby.removePlayer(player);
    socket.leave("lobby");
    io.to("lobby").emit("lobbyUpdate", {status: player + " is now offline.", players: lobby.players, rooms: lobby.rooms});
  };

  socket.on("disconnect", function(data) {
    onDisconnect();
  });

  socket.on("disconnectFromLobby", function(data) {
    onDisconnect();
  });

  socket.on("connectToLobby", function(data) {
    if (!isAuthenticated()) return;
    let player = socket.handshake.session.username;
    lobby.addPlayer(player);
    io.to("lobby").emit("lobbyUpdate", {status: player + " is now online.", players: lobby.players, rooms: lobby.rooms});
    socket.emit("serverUpdate", {status: "Welcome, " + player + "!", username: player});
    socket.emit("lobbyUpdate",  {players: lobby.players, rooms: lobby.rooms});
    socket.join("lobby");
  });

  socket.on("createRoom", function(data) {
    if (!isAuthenticated()) return;

    let player = socket.handshake.session.username;
    if (lobby.findPlayerRoom(player)) {
      socket.emit("serverUpdate", {status: "You are already in a room."});
      return;
    }
    let title = data.title ? data.title : "Let's Play " + data.game + "!";
    let game = data.game;
    let password = data.password ? data.password : "";
    let room = lobby.createRoom(title, game, password, player);
    socket.leave("lobby");
    io.to("lobby").emit("lobbyUpdate", {status: player + " has created a new " + game + " room. [" + title + "]", players: lobby.players, rooms: lobby.rooms});
    socket.handshake.session.roomId = room.id;
    socket.join(room.id);
    io.to(room.id).emit("roomUpdate", {status: player + " has joined the room.", room: room});
  });

  socket.on("joinRoom", function(data) {
    if (!isAuthenticated()) return;
    let player = socket.handshake.session.username;
    if (lobby.findPlayerRoom(player)) {
      socket.emit("serverUpdate", {status: "You are already in a room."});
      return;
    }
    let roomId = data.roomId;
    let room = lobby.findRoom(roomId);
    let password = data.password;
    if (!lobby.testRoomPassword(room, password)) {
      socket.emit("serverUpdate", {status: "You did not enter the correct password for the room."});
      return;
    }
    if (!lobby.connectPlayerToRoom(room, player, password)) {
      socket.emit("serverUpdate", {status: "The room is full."});
      return;
    }
    socket.handshake.session.roomId = room.id;
    socket.leave("lobby");
    socket.to("lobby").emit("lobbyUpdate",  {players: lobby.players, rooms: lobby.rooms});
    socket.join(room.id);
    io.to(room.id).emit("roomUpdate", {status: player + " has joined the room.", room: room});
  });
});

server.listen(PORT, function() {
  console.log(`Listening On Port ${PORT}`);
});
