import io from "socket.io-client";
import React from "react";
import Lobby from "../Lobby/Lobby";
import Game from "../Game/Game";
import Chat from "../Chat/Chat";
import "./Main.css";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io(),
      username: "",
      roomId: "",
    };
  }

  componentDidMount() {
    this.state.socket.onAny(function(event, ...args) {
      console.log("Socket Event:", event, args);
    });

    this.state.socket.on("authenticationRequired", data => {
      this.props.history.push("/login");
    });

    this.state.socket.on("serverUpdate", data => {
      this.setState({username: data.username, roomId: data.roomId});
    });

    this.state.socket.emit("connectToServer", {});
  }

  render() {
    let Main = !this.state.roomId
      ? <Lobby socket={this.state.socket} username={this.state.username}></Lobby>
      : <Game socket={this.state.socket} username={this.state.username} room={this.state.room}></Game>

    return (
      <div className="container" id="main">
        {Main}
        <Chat socket={this.state.socket}></Chat>
      </div>
    );
  }
};

export default Main;
