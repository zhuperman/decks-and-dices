import React from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import io from "socket.io-client";
import "./Lobby.css";

let socket = "";
class Lobby extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      hidden: true,
      status: "",
      username: "",
      lobby: {
        players: [],
        rooms: []
      },
      newRoom: {
        title: "",
        gameMode: "checkers",
        private: true,
        password: ""
      }
    };

    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleNewRoomTitle = this.handleNewRoomTitle.bind(this);
    this.handleNewRoomGameMode = this.handleNewRoomGameMode.bind(this);
    this.handleNewRoomLock = this.handleNewRoomLock.bind(this);
    this.handleNewRoomPassword = this.handleNewRoomPassword.bind(this);
    this.handleNewRoomCreate = this.handleNewRoomCreate.bind(this);
	}

  componentDidMount() {
    fetch("/lobby", {
      method: "GET",
    }).then(response => response.json())
    .then(data => {
      this.setState({status: data.status});
      if (data.status === "Authentication Required") {
        this.props.history.push("/login");
      } else {
        this.setState({hidden: false, username: data.username, lobby: data.lobby});
        console.log(this.state);
        socket = io();
        socket.emit("connectToLobby", {username: data.username});
      }
    });
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

  handleNewRoomGameMode(event) {
    this.setState({newRoom: {...this.state.newRoom, gameMode: event.target.value.toLowerCase()}});

  }

  handleNewRoomLock(event) {
    this.setState({newRoom: {...this.state.newRoom, private: !this.state.newRoom.private, password: ""}});
  }

  handleNewRoomPassword(event) {
    this.setState({newRoom: {...this.state.newRoom, password: event.target.value}});
  }

  handleNewRoomCreate(event) {
    console.log(this.state.newRoom);
  }

	render() {
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
                <button className={"input-group-prepend-icon game " + this.state.newRoom.gameMode} disabled></button>
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
                    <select className="game-mode" onChange={this.handleNewRoomGameMode}>
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
                    <button className="input-group-prepend-icon player"></button>
                    <button className="input-group-prepend-icon player"></button>
                    <button className="input-group-prepend-icon player"></button>
                    <button className="input-group-prepend-icon player"></button>
                  </div>
                </div>
                <button className="input-group-append-icon create" onClick={this.handleNewRoomCreate}></button>
              </div>
              <div className="room" id="a" style={{animation: "loadRoom 2s"}}>
                <button className="input-group-prepend-icon game poker" disabled></button>
                <div className="room-info">
                  <InputGroup>
                    <span className="input-group-text room-title">Let's Play Poker!</span>
                    <InputGroup.Append>
                      <button className="input-group-append-icon lock" disabled></button>
                    </InputGroup.Append>
                  </InputGroup>
                  <span className="description">Game Mode: Poker</span>
                  <div className="player-count">
                    <button className="input-group-prepend-icon player"></button>
                    <button className="input-group-prepend-icon player"></button>
                    <button className="input-group-prepend-icon player"></button>
                    <button className="input-group-prepend-icon player"></button>
                  </div>
                </div>
                <button className="input-group-append-icon join"></button>
              </div>
              <div className="room" id="a" style={{animation: "loadRoom 3s"}}>
                <button className="input-group-prepend-icon game checkers" disabled></button>
                <div className="room-info">
                  <InputGroup>
                    <span className="input-group-text room-title">Let's Play Checkers!</span>
                    <InputGroup.Append>
                      <button className="input-group-append-icon unlock" disabled></button>
                    </InputGroup.Append>
                  </InputGroup>
                  <span className="description">Game Mode: Checkers</span>
                  <div className="player-count">
                    <button className="input-group-prepend-icon player"></button>
                    <button className="input-group-prepend-icon player bw"></button>
                  </div>
                </div>
                <button className="input-group-append-icon join"></button>
              </div>
              <div className="room" id="a" style={{animation: "loadRoom 4s"}}>
                <button className="input-group-prepend-icon game chess" disabled></button>
                <div className="room-info">
                  <InputGroup>
                    <span className="input-group-text room-title">Let's Play Chess!</span>
                    <InputGroup.Append>
                      <button className="input-group-append-icon lock" disabled></button>
                    </InputGroup.Append>
                  </InputGroup>
                  <span className="description">Game Mode: Chess</span>
                  <div className="player-count">
                    <button className="input-group-prepend-icon player bw"></button>
                    <button className="input-group-prepend-icon player bw"></button>
                  </div>
                </div>
                <button className="input-group-append-icon join"></button>
              </div>
              <div className="room" id="a" style={{animation: "loadRoom 5s"}}>
                <button className="input-group-prepend-icon game monopoly" disabled></button>
                <div className="room-info">
                  <InputGroup>
                    <span className="input-group-text room-title">Let's Play Monopoly!</span>
                    <InputGroup.Append>
                      <button className="input-group-append-icon lock" disabled></button>
                    </InputGroup.Append>
                  </InputGroup>
                  <span className="description">Game Mode: Monopoly</span>
                  <div className="player-count">
                    <button className="input-group-prepend-icon player"></button>
                    <button className="input-group-prepend-icon player"></button>
                    <button className="input-group-prepend-icon player bw"></button>
                    <button className="input-group-prepend-icon player bw"></button>
                  </div>
                </div>
                <button className="input-group-append-icon join"></button>
              </div>
              <div className="room" id="a" style={{animation: "loadRoom 5.5s"}}>
                <button className="input-group-prepend-icon game mahjong" disabled></button>
                <div className="room-info">
                  <InputGroup>
                    <span className="input-group-text room-title">Let's Play Mahjong!</span>
                    <InputGroup.Append>
                      <button className="input-group-append-icon unlock" disabled></button>
                    </InputGroup.Append>
                  </InputGroup>
                  <span className="description">Game Mode: Mahjong</span>
                  <div className="player-count">
                    <button className="input-group-prepend-icon player"></button>
                    <button className="input-group-prepend-icon player"></button>
                    <button className="input-group-prepend-icon player"></button>
                    <button className="input-group-prepend-icon player bw"></button>
                  </div>
                </div>
                <button className="input-group-append-icon join"></button>
              </div>
              <div className="room" id="a" style={{animation: "loadRoom 6s"}}>
                <button className="input-group-prepend-icon game yahtzee" disabled></button>
                <div className="room-info">
                  <InputGroup>
                    <span className="input-group-text room-title">Let's Play Yahtzee!</span>
                    <InputGroup.Append>
                      <button className="input-group-append-icon unlock" disabled></button>
                    </InputGroup.Append>
                  </InputGroup>
                  <span className="description">Game Mode: Yahtzee</span>
                  <div className="player-count">
                    <button className="input-group-prepend-icon player"></button>
                    <button className="input-group-prepend-icon player"></button>
                    <button className="input-group-prepend-icon player"></button>
                    <button className="input-group-prepend-icon player"></button>
                  </div>
                </div>
                <button className="input-group-append-icon join"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export default Lobby;
