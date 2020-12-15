import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import QueriedRooms from "./QueriedRooms/QueriedRooms";
import "./Lobby.css";

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      rooms: []
    };
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    this.props.socket.on("lobbyUpdate", data => {
      this.setState({
        players: data.players ? data.players: this.state.players,
        rooms: data.rooms ? data.rooms: this.state.rooms
      });
    });

    this.props.socket.emit("connectToLobby", {});
  }

  handleSignOut(event) {
    this.props.socket.emit("disconnectFromServer", {});
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
      <div className="lobby-container">
        <div className="header">
          <h1>Lobby</h1>
          <InputGroup className="account">
            <InputGroup.Prepend>
              <button className="input-group-prepend-icon" disabled></button>
            </InputGroup.Prepend>
            <span className="username-display">{this.props.username}</span>
            <span className="divider">|</span>
            <span className="sign-out" onClick={this.handleSignOut}>Sign Out</span>
          </InputGroup>
        </div>
        <QueriedRooms socket={this.props.socket} rooms={this.state.rooms}></QueriedRooms>
      </div>
    );
  }
};
export default Lobby;
