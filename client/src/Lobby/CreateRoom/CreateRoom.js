import React from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import "./CreateRoom.css";

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      game: "Checkers",
      private: true,
      password: ""
    };
    this.handleTitle = this.handleTitle.bind(this);
    this.handleGame = this.handleGame.bind(this);
    this.handleLock = this.handleLock.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleTitle(event) {
    this.setState({title: event.target.value});
  }

  handleGame(event) {
    this.setState({game: event.target.value});
  }

  handleLock(event) {
    this.setState({private: !this.state.private, password: ""});
  }

  handlePassword(event) {
    this.setState({password: event.target.value});
  }

  handleCreate(event) {
    this.props.socket.emit("createRoom", this.state);
  }

  render() {
    return (
      <div className="room" style={{animation: "loadRoom 1s"}}>
        <button className={"input-group-prepend-icon game-thumbnail " + this.state.game.toLowerCase()} disabled></button>
        <div className="room-info">
          <InputGroup className="room-title">
            <FormControl className="input-group-text"
              type="text"
              placeholder="Enter a title for your room"
              value={this.state.title}
              onChange={this.handleTitle}
            />
            <InputGroup.Append>
              <button className={this.state.private ? "input-group-append-icon lock" : "input-group-append-icon unlock"} onClick={this.handleLock}></button>
            </InputGroup.Append>
          </InputGroup>
          <div className="room-details">
            <div className="select-container">
              <span>Game Mode:</span>
              <select onChange={this.handleGame}>
                <option value="Checkers">Checkers</option>
                <option value="Chess">Chess</option>
                <option value="Mahjong">Mahjong</option>
                <option value="Monopoly">Monopoly</option>
                <option value="Poker">Poker</option>
                <option value="Yahtzee">Yahtzee</option>
              </select>
            </div>
            <InputGroup className="room-password" style={this.state.private ? {visibility: "visible"} : {visibility: "hidden"}}>
              <InputGroup.Prepend>
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
          {this.props.playerCount([], this.state.game)}
        </div>
        <button className="input-group-append-icon create" onClick={this.handleCreate}></button>
      </div>
    )
  }
};

export default CreateRoom;
