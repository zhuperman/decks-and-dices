import React from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import io from "socket.io-client";
import "./Lobby.css";

let socket;
const maxPlayers = {"Chess": 2, "Checkers": 2, "Mahjong": 4, "Monopoly": 4, "Poker": 4, "Yahtzee": 8}
let playerDisplay = function(players, maxPlayers) {
  let display = []
  let i;
  for (i = 0; i < maxPlayers; i++) {
    if (i < players.length) {
      display.push(<button className="input-group-prepend-icon player"></button>);
    } else {
      display.push(<button className="input-group-prepend-icon player bw"></button>);
    }
  }
  return display;
};

class Lobby extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      hidden: true,
      username: "",
      lobby: {
        players: [],
        rooms: []
      },
      newRoom: {
        title: "",
        game: "Checkers",
        private: true,
        password: ""
      }
    };
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleNewRoomTitle = this.handleNewRoomTitle.bind(this);
    this.handleNewRoomGame = this.handleNewRoomGame.bind(this);
    this.handleNewRoomLock = this.handleNewRoomLock.bind(this);
    this.handleNewRoomPassword = this.handleNewRoomPassword.bind(this);
    this.handleNewRoomCreate = this.handleNewRoomCreate.bind(this);
	}

  componentDidMount() {
    socket = io();
    socket.on("authenticationRequired", data => this.props.history.push("/login"));
    socket.on("joinedLobby", data => {this.setState({username: data.username, lobby: data.lobby})});
    socket.on("createdRoom", data => {this.setState({lobby: data.lobby})});
    socket.on("roomCreated", data => {this.setState({lobby: data.lobby})});
    socket.emit("connectToLobby", {});
  }

  handleSignOut(event) {
    socket.emit("disconnectFromLobby", {});
    fetch("/logout", {
      method: "POST"
    }).then(response => response.json())
    .then(data => {
      if (data.status === "Logout Successful.") {
        this.props.history.push("/login");
      }
    });
  }

  handleNewRoomTitle(event) {
    this.setState({newRoom: {...this.state.newRoom, title: event.target.value}});
  }

  handleNewRoomGame(event) {
    this.setState({newRoom: {...this.state.newRoom, game: event.target.value}});
  }

  handleNewRoomLock(event) {
    this.setState({newRoom: {...this.state.newRoom, private: !this.state.newRoom.private, password: ""}});
  }

  handleNewRoomPassword(event) {
    this.setState({newRoom: {...this.state.newRoom, password: event.target.value}});
  }

  handleNewRoomCreate(event) {
    socket.emit("createRoom", this.state.newRoom);
  }

	render() {
    let rooms = this.state.lobby.rooms.map((room, i) => <Room key={room.id} id={room.id} index={i} title={room.title} game={room.game} private={room.private} players={room.players} maxPlayers={room.maxPlayers}></Room>);
    return (
      <div className="container" id="lobby">
        <div className="lobby-container">
          <div className="lobby-header">
            <h1>Lobby</h1>
            <InputGroup className="account">
              <InputGroup.Prepend className="profile-pic">
                <button className="input-group-prepend-icon profile-pic" disabled></button>
              </InputGroup.Prepend>
              <span className="username-display">{this.state.username}</span>
              <span className="divider">|</span>
              <span className="sign-out" onClick={this.handleSignOut}>Sign Out</span>
            </InputGroup>
          </div>
          <div className="rooms-container">
            <div className="rooms">
              <div className="room" style={{animation: "loadRoom 1s"}}>
                <button className={"input-group-prepend-icon game " + this.state.newRoom.game.toLowerCase()} disabled></button>
                <div className="room-info">
                  <InputGroup>
                    <FormControl className="input-group-text room-title"
                      type="text"
                      placeholder="Enter a title for your room"
                      value={this.state.newRoom.title}
                      onChange={this.handleNewRoomTitle}
                    />
                    <InputGroup.Append>
                      <button className={this.state.newRoom.private ? "input-group-append-icon lock" : "input-group-append-icon unlock"} onClick={this.handleNewRoomLock}></button>
                    </InputGroup.Append>
                  </InputGroup>
                  <div className="description-container">
                    <span className="description">Game Mode:</span>
                    <select className="game-mode" onChange={this.handleNewRoomGame}>
                      <option value="Checkers">Checkers</option>
                      <option value="Chess">Chess</option>
                      <option value="Mahjong">Mahjong</option>
                      <option value="Monopoly">Monopoly</option>
                      <option value="Poker">Poker</option>
                      <option value="Yahtzee">Yahtzee</option>
                    </select>
                    <InputGroup className="room-password" style={this.state.newRoom.private ? {visibility: "visible"} : {visibility: "hidden"}}>
                      <InputGroup.Prepend className="room-password">
                        <button className="input-group-prepend-icon room-password" disabled></button>
                      </InputGroup.Prepend>
                      <FormControl className="input-group-text room-password"
                        type="password"
                        placeholder="Password"
                        value={this.state.newRoom.password}
                        onChange={this.handleNewRoomPassword}
                      />
                    </InputGroup>
                  </div>
                  <div className="player-count">
                    {playerDisplay([], maxPlayers[this.state.newRoom.game])}
                  </div>
                </div>
                <button className="input-group-append-icon create" onClick={this.handleNewRoomCreate}></button>
              </div>
              {rooms}
            </div>
          </div>
        </div>
      </div>
    )
  }
};

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: ""
    };
    this.handlePassword = this.handlePassword.bind(this);
    this.handleJoinRoom = this.handleJoinRoom.bind(this);
  }

  handlePassword(event) {
    this.setState({password: event.target.value});
  }

  handleJoinRoom(event) {
    console.log(event);
  }

  render() {
    let animationTime = function(index) {
      if (index < 4) {
        return 2 + index
      }
      return 5.5 + 0.5 * (index - 4)
    };

    return (
      <div className="room" id={this.props.id} style={{animation: "loadRoom " + animationTime(this.props.index) + "s"}}>
        <button className={"input-group-prepend-icon game " + this.props.game.toLowerCase()} disabled></button>
        <div className="room-info">
          <InputGroup>
            <span className="input-group-text room-title">{this.props.title}</span>
            <InputGroup.Append>
              <button className={this.props.private ? "input-group-append-icon lock" : "input-group-append-icon unlock"} disabled></button>
            </InputGroup.Append>
          </InputGroup>
          <div className="description-container">
            <span className="description">{"Game Mode: " + this.props.game}</span>
            <InputGroup className="room-password" style={this.props.private ? {visibility: "visible"} : {visibility: "hidden"}}>
              <InputGroup.Prepend className="room-password">
                <button className="input-group-prepend-icon room-password" disabled></button>
              </InputGroup.Prepend>
              <FormControl className="input-group-text room-password"
                type="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handlePassword}
              />
            </InputGroup>
          </div>
          <div className="player-count">
            {playerDisplay(this.props.players, this.props.maxPlayers)}
          </div>
        </div>
        <button className="input-group-append-icon join" onClick={this.handleJoinRoom}></button>
      </div>
    )
  }
}

export default Lobby;
