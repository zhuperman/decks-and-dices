import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import QueriedRooms from "./QueriedRooms/QueriedRooms";
import io from "socket.io-client";
import Chat from "../Chat/Chat";
import "./Lobby.css";

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io(),
      username: "",
      players: [],
      rooms: []
    };
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {

    this.state.socket.onAny(function(event, ...args) {
      console.log("Socket Event:", event, args);
    });

    this.state.socket.on("authenticationRequired", data => {
      this.props.history.push("/login");
    });

    this.state.socket.on("serverUpdate", data => {
      this.setState({username: data.username ? data.username : this.state.username});
    });

    this.state.socket.on("lobbyUpdate", data => {
      this.setState({
        players: data.players ? data.players: this.state.players,
        rooms: data.rooms ? data.rooms: this.state.rooms
      });
    });

    this.state.socket.emit("connectToLobby", {});
  }

  handleSignOut(event) {
    this.state.socket.emit("disconnectFromLobby", {});
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
          <div className="header">
            <h1>Lobby</h1>
            <InputGroup className="account">
              <InputGroup.Prepend>
                <button className="input-group-prepend-icon" disabled></button>
              </InputGroup.Prepend>
              <span className="username-display">{this.state.username}</span>
              <span className="divider">|</span>
              <span className="sign-out" onClick={this.handleSignOut}>Sign Out</span>
            </InputGroup>
          </div>
          <QueriedRooms socket={this.state.socket} rooms={this.state.rooms}></QueriedRooms>
        </div>
        <Chat socket={this.state.socket}></Chat>
      </div>
    )
  }
};

export default Lobby;
