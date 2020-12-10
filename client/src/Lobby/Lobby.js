import React from "react";
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
        title: ""
      }
    };

    this.handleSignOut = this.handleSignOut.bind(this);
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

	render() {
    return (
      <div className="container" id="lobby">
        <div className="lobby-container">
          <div className="lobby-header">
            <h1>Lobby</h1>
            <InputGroup className="account">
              <InputGroup.Prepend className="prepend-profile-pic">
                <button className="input-group-prepend-icon profile-pic" disabled></button>
              </InputGroup.Prepend>
              <span className="username-display">{this.state.username}</span>
              <pre> | </pre>
              <span className="sign-out" onClick={this.handleSignOut}>Sign Out</span>
            </InputGroup>
          </div>
          <div className="rooms-container">
            <div className="rooms">
              <div className="room" id="a">
                <btn className="thumbnail poker" disabled></btn>
                <div className="room-info">
                  <InputGroup className="title">Let's Play Poker!
                    <InputGroup.Append>
                      <button className="input-group-append-icon lock" disabled></button>
                    </InputGroup.Append>
                  </InputGroup>
                  <span className="description">Game Mode: Poker</span>
                  <div className="player-count">
                    <btn className="player"></btn>
                    <btn className="player"></btn>
                    <btn className="player"></btn>
                    <btn className="player"></btn>
                  </div>
                </div>
                <btn className="join-btn">Join</btn>
              </div>
              <div className="room" id="a">
                <btn className="thumbnail mahjong" disabled></btn>
                <div className="room-info">
                  <InputGroup className="title">Let's Play Mahjong!
                    <InputGroup.Append>
                      <button className="input-group-append-icon unlock" disabled></button>
                    </InputGroup.Append>
                  </InputGroup>
                  <span className="description">Game Mode: Mahjong</span>
                  <div className="player-count">
                    <btn className="player"></btn>
                    <btn className="player"></btn>
                    <btn className="player"></btn>
                    <btn className="player bw"></btn>
                  </div>
                </div>
                <btn className="join-btn">Join</btn>
              </div>
              <div className="room" id="a">
                <btn className="thumbnail monopoly" disabled></btn>
                <div className="room-info">
                  <InputGroup className="title">Let's Play Monopoly!
                    <InputGroup.Append>
                      <button className="input-group-append-icon lock" disabled></button>
                    </InputGroup.Append>
                  </InputGroup>
                  <span className="description">Game Mode: Monopoly</span>
                  <div className="player-count">
                    <btn className="player"></btn>
                    <btn className="player"></btn>
                    <btn className="player bw"></btn>
                    <btn className="player bw"></btn>
                  </div>
                </div>
                <btn className="join-btn">Join</btn>
              </div>
              <div className="room" id="a">
                <btn className="thumbnail checkers" disabled></btn>
                <div className="room-info">
                  <InputGroup className="title">Let's Play Checkers!
                  <InputGroup.Append>
                      <button className="input-group-append-icon unlock" disabled></button>
                    </InputGroup.Append>
                  </InputGroup>
                  <span className="description">Game Mode: Checkers</span>
                  <div className="player-count">
                    <btn className="player"></btn>
                    <btn className="player bw"></btn>
                  </div>
                </div>
                <btn className="join-btn">Join</btn>
              </div>
              <div className="room" id="a">
                <btn className="thumbnail chess" disabled></btn>
                <div className="room-info">
                  <InputGroup className="title">Let's Play Chess!
                    <InputGroup.Append>
                      <button className="input-group-append-icon lock" disabled></button>
                    </InputGroup.Append>
                  </InputGroup>
                  <span className="description">Game Mode: Chess</span>
                  <div className="player-count">
                    <btn className="player bw"></btn>
                    <btn className="player bw"></btn>
                  </div>
                </div>
                <btn className="join-btn">Join</btn>
              </div>
              <div className="room" id="a">
                <btn className="thumbnail yahtzee" disabled></btn>
                <div className="room-info">
                  <InputGroup className="title">Let's Play Yahtzee!
                  <InputGroup.Append>
                      <button className="input-group-append-icon unlock" disabled></button>
                    </InputGroup.Append>
                  </InputGroup>
                  <span className="description">Game Mode: Yahtzee</span>
                  <div className="player-count">
                    <btn className="player"></btn>
                    <btn className="player"></btn>
                    <btn className="player"></btn>
                    <btn className="player"></btn>
                  </div>
                </div>
                <btn className="join-btn">Join</btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export default Lobby;
