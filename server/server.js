const Lobby = require("./lobby");
const Player = require("./player");
const Room = require("./room");
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
let roomPasswords = {};
let interval;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session);
io.use(socketSession(session, {
  autoSave: true
}));

app.use(function (req, res, next) {
  console.log("HTTP Request:", req.sessionID + ":" + req.session.username, req.method, req.url, req.body);
  next();
});

app.post("/register", function (req, res, next) {
  let username = req.body.username;
  let usernameLowerCase = username.toLowerCase();
  let password = req.body.password;
  let email = req.body.email.toLowerCase();
  let salt = crypto.randomBytes(16).toString("base64");
  let hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  let saltedHash = hash.digest("base64");
  users.findOne({usernameLowerCase: usernameLowerCase}, function(err, user) {
    if (err) return res.status(500).json({status: err});
    if (user) return res.status(409).json({status: "The username you entered is already registered."});
    users.findOne({email: email}, function(err, user) {
      if (err) return res.status(500).json({status: err});
      if (user) return res.status(409).json({status: "The email you entered is already registered."});
      users.update({username: username}, {username, usernameLowerCase, salt, saltedHash, email}, {upsert: true}, function(err) {
        if (err) return res.status(500).json({status: err});
        req.session.username = username;
        return res.json({status: "Registration Successful."});
      });
    });
  });
});

app.post("/login", function (req, res, next) {
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
    req.session.username = username;
    return res.json({status: "Login Successful."});
  });
});

app.post("/logout", function (req, res, next) {
  req.session.destroy(function(err) {
    return err ? res.json({status: "Logout Unsuccessful."}) : res.json({status: "Logout Successful."});
  });
});

let refresh = function(socket) {
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(function() {
    //TODO
  }, 1000);
};

let isAuthenticated = function(socket) {
  if (!socket.handshake.session.username) {
    socket.emit("authenticationRequired", {status: "You do not have permissions required for this request."});
      return;
  }
};

io.sockets.on("connection", function(socket) {

  socket.onAny(function(event, ...args) {
    console.log("Socket Event:", socket.handshake.sessionID + ":" + socket.handshake.session.username, event);
  });

  socket.on("disconnect", function(data) {
    let player = lobby.getPlayer(socket.handshake.session.username);
    socket.handshake.session.destroy(err => {});
    if (!player) return;
    let room = lobby.getRoom(player.roomId);
    if (room) {
      room.disconnectPlayer(player.username);
      if (room.players.length == 0) lobby.removeRoom(room.id);
    } else {
      lobby.removePlayer(player.username);
    }
    io.sockets.emit("playerOffline", {status: player.username + " has left the lobby."});
  });

  socket.on("disconnectFromLobby", function(data) {
    let player = lobby.getPlayer(socket.handshake.session.username);
    socket.handshake.session.destroy(err => {});
    if (!player) return;
    let room = lobby.getRoom(player.roomId);
    if (room) {
      room.disconnectPlayer(player.username);
      if (room.players.length == 0) lobby.removeRoom(room.id);
    } else {
      lobby.removePlayer(player.username);
    }
    io.sockets.emit("playerOffline", {status: player.username + " has left the lobby."});
  });

  socket.on("connectToLobby", function(data) {
    isAuthenticated(socket);
    let username = socket.handshake.session.username;
    let player = new Player(username, socket.id);
    lobby.addPlayer(player);
    socket.emit("joinedLobby", {status: "Welcome!", username: username, lobby: lobby});
    io.sockets.emit("playerOnline", {status: username + " has joined the lobby."});
  });

  socket.on("createRoom", function(data) {
    isAuthenticated(socket);
    let username = socket.handshake.session.username;
    let title = data.title;
    if (!title) {
      title = "Let's Play " + data.game + "!";
    }
    let player = lobby.getPlayer(username);
    if (player) {
      let room = new Room(title, data.game, data.password.length > 0);
      roomPasswords[room.id] = data.password;
      lobby.addRoom(room);
      room.connectPlayer(player);
      lobby.removePlayer(username);
      io.sockets.emit("roomCreated", {status: username + " has created a new room. [" + data.title + "]", lobby: lobby});
    }
  })
});

server.listen(PORT, function() {
  console.log(`Listening On Port ${PORT}`);
});
