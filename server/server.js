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

let isAuthenticated = function(req, res, next) {
  if (!req.session.username) return res.status(401).json({status: "Authentication Required"});
  return next();
};

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

app.get("/lobby", isAuthenticated, function (req, res, next) {
  return res.json({status: "Welcome!", username: req.session.username, lobby: lobby});
});

let refresh = function(socket) {
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(function() {
    //TODO
  }, 1000);
};

io.sockets.on("connection", function(socket) {

  socket.onAny(function(event, ...args) {
    console.log("Socket Event:", socket.handshake.sessionID + ":" + socket.handshake.session.username, event);
  });

  socket.on("disconnect", function(data) {
    let player = lobby.getPlayer(socket.handshake.session.username);
    if (!player) return;
    let username = player.getUsername();
    lobby.removePlayer(socket.id);
    io.sockets.emit("playerOffline", {message: username + " has left the lobby."});
  });

  socket.on("disconnectFromLobby", function(data) {
    let player = lobby.getPlayer(socket.handshake.session.username);
    if (!player) return;
    let username = player.getUsername();
    lobby.removePlayer(socket.id);
    io.sockets.emit("playerOffline", {message: username + " has left the lobby."});
  });

  socket.on("connectToLobby", function(data) {
    let player = new Player();
    let username = socket.handshake.session.username;
    player.setUsername(username);
    lobby.addPlayer(player);
    player.setConnection(socket.id);
    lobby.addPlayer(player);
    io.sockets.emit("playerOnline", {message: username + " has joined the lobby."});
  });
});

server.listen(PORT, function() {
  console.log(`Listening On Port ${PORT}`);
});
