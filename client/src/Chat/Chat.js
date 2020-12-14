import React from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import "./Chat.css";

class Chat extends React.Component {
  constructor(props) {
  super(props);
    this.state = {
      messages: [],
      message: ""
    };
    this.handleMessage = this.handleMessage.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  componentDidMount() {
    this.props.socket.on("userMessage", data => {
      this.setState({messages: data.status ? this.state.messages.concat("[" + data.username + "] " + data.status) : this.state.messages});
    });

    this.props.socket.on("serverUpdate", data => {
      this.setState({messages: data.status ? this.state.messages.concat("[Server] " + data.status) : this.state.messages});
    });

    this.props.socket.on("lobbyUpdate", data => {
      this.setState({messages: data.status ? this.state.messages.concat("[Lobby] " + data.status) : this.state.messages});
    });

    this.props.socket.on("roomUpdate", data => {
      this.setState({messages: data.status ? this.state.messages.concat("[Room] " + data.status) : this.state.messages});
    });
  }

  handleMessage(event) {
    this.setState({message: event.target.value});
  }

  handleSendMessage(event) {
    this.props.socket.emit("sendMessage", {message: this.state.message});
    this.setState({message: ""});
  }

  handleEnter(event) {
    if (event.key !== "Enter") return;
    this.handleSendMessage(event);
  }

  render() {
    let messages = this.state.messages.map((message, i) => (<span key={i}>{message}<br></br></span>));

    return (
      <div className="chat-container">
        <div className="header">
          <h1>Chat</h1>
        </div>
        <div className="messages-container">
          {messages}
        </div>
        <InputGroup className="message-input">
          <InputGroup.Prepend>
            <button className={this.state.message ? "input-group-prepend-icon typing" : "input-group-prepend-icon"} disabled></button>
          </InputGroup.Prepend>
          <FormControl className="input-group-text"
              type="text"
              placeholder="Message"
              value={this.state.message}
              onChange={this.handleMessage}
              onKeyDown={this.handleEnter}
            />
          <InputGroup.Append>
            <button className="input-group-append-icon" onClick={this.handleSendMessage}></button>
          </InputGroup.Append>
        </InputGroup>
      </div>
      )
   }
};

export default Chat;
