import React from "react";
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
        <button className="sign-btn" onClick={this.handleSignOut}>Sign Out</button>
      </div>
    )
  }
};

export default Lobby;
