import React from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import "./Room.css";

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
    };
    this.handlePassword = this.handlePassword.bind(this);
    this.handleJoinRoom = this.handleJoinRoom.bind(this);
  }

  handlePassword(event) {
    this.setState({password: event.target.value});
  }

  handleJoinRoom(event) {
    this.props.socket.emit("joinRoom", {roomId: this.props.id, password: this.state.password});
  }

  render() {
    return (
      <div className="room" id={this.props.id} style={{animation: "loadRoom " + this.props.animationTime + "s"}}>
        <button className={"game-thumbnail " + this.props.game.toLowerCase()} disabled></button>
        <div className="room-info">
          <InputGroup className="room-title">
            <span className="input-group-text">{this.props.title}</span>
            <InputGroup.Append>
              <button className={this.props.private ? "input-group-append-icon lock" : "input-group-append-icon unlock"} disabled></button>
            </InputGroup.Append>
          </InputGroup>
          <div className="room-details">
            <div className="select-container">
              <span>Game Mode:</span>
              <select disabled>
                <option value={this.props.game}>{this.props.game}</option>
              </select>
            </div>
            <InputGroup className="room-password" style={this.props.private ? {visibility: "visible"} : {visibility: "hidden"}}>
              <InputGroup.Prepend className>
                <button className="input-group-prepend-icon" disabled></button>
              </InputGroup.Prepend>
              <FormControl className="input-group-text"
                type="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handlePassword}
              />
            </InputGroup>
          </div>
          {this.props.playerCount(this.props.players, this.props.game)}
        </div>
        <button className="join" onClick={this.handleJoinRoom}></button>
      </div>
    )
  }
}

export default Room;
