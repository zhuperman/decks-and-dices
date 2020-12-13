import React from "react";
import CreateRoom from "../CreateRoom/CreateRoom";
import Room from "../Room/Room";
import "./Rooms.css";

class Rooms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let playerCount = function(players, game) {
      const maxPlayers = {"Chess": 2, "Checkers": 2, "Mahjong": 4, "Monopoly": 4, "Poker": 4, "Yahtzee": 8}[game];
      let playerDisplay = new Array(maxPlayers).fill(0);
      playerDisplay = playerDisplay.map((_, i) => i < players.length
          ? (<button className="input-group-prepend-icon player" key={i}></button>)
          : (<button className="input-group-prepend-icon player bw" key={i}></button>)
      );
      return (<div className="player-count">{playerDisplay}</div>);
    };

    let rooms = this.props.rooms.map(room => ((
      <Room
        key={room.key}
        id={room.id}
        index={room.index}
        title={room.title}
        game={room.game}
        private={room.private}
        players={room.players}
        maxPlayers={room.maxPlayers}
        playerCount={playerCount}
        animationTime={room.animationTime}
        socket={this.props.socket}>
      </Room>
    )));

    return (
      <div className="rooms-container">
        <div className="rooms">
          <CreateRoom socket={this.props.socket} playerCount={playerCount}></CreateRoom>
          {rooms}
        </div>
      </div>
    )
  }
};

export default Rooms;
