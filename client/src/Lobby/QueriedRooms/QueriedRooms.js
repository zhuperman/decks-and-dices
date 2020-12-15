import React from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Rooms from "../Rooms/Rooms";
import "./QueriedRooms.css";

class QueriedRooms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      filter: "None",
      sort: "Default",
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  handleSearch(event) {
    this.setState({search: event.target.value});
  }

  handleFilter(event) {
    this.setState({filter: event.target.value});
  }

  handleSort(event) {
    this.setState({sort: event.target.value});
  }

  render() {
    let queriedRooms = this.props.rooms;
    let query = this.state;
    let combinedFilter = function(room) {
      let visibility = true;
      if (query.filter !== "None" && query.filter !== room.game) visibility = false;
      if (query.search && !(room.title.toLowerCase().includes(query.search.toLowerCase()) || room.game.toLowerCase().includes(query.search.toLowerCase()))) visibility = false;
      return visibility;
    };
    queriedRooms = queriedRooms.filter(room => combinedFilter(room));
    switch (query.sort) {
      default: queriedRooms = [...queriedRooms.sort((room1, room2) => room1.date < room2.date ? -1 : 1)]; break;
      case "New": queriedRooms = [...queriedRooms.sort((room1, room2) => room1.date >= room2.date ? -1 : 1)]; break;
      case "Game": queriedRooms = [...queriedRooms.sort((room1, room2) => room1.game < room2.game ? -1 : 1)]; break;
      case "Players": queriedRooms = [...queriedRooms.sort((room1, room2) => room1.players.length > room2.players.length ? -1 : 1)]; break;
    }
    queriedRooms.map((room, i) => room.index = i);
    queriedRooms.map(room => room.key = room.index + room.id + query.search + query.filter + query.sort);
    queriedRooms.map(room => room.animationTime = room.index < 5 ? 1.5 + 0.5 * (room.index) : Math.min(4 + 0.25 * (room.index - 4), 5));

    return (
      <div className="queried-rooms-wrapper">
        <div className="query-container">
          <InputGroup className="search">
            <InputGroup.Prepend>
              <button className="input-group-prepend-icon" disabled></button>
            </InputGroup.Prepend>
            <FormControl className="input-group-text"
              type="text"
              placeholder="Search"
              value={this.state.search}
              onChange={this.handleSearch}
            />
          </InputGroup>
          <div className="filter">
            <div className="select-container">
              <span>Filter:</span>
              <select value={this.state.filter} onChange={this.handleFilter}>
                <option value="None">None</option>
                <option value="Checkers">Checkers</option>
                <option value="Chess">Chess</option>
                <option value="Mahjong">Mahjong</option>
                <option value="Monopoly">Monopoly</option>
                <option value="Poker">Poker</option>
                <option value="Yahtzee">Yahtzee</option>
              </select>
            </div>
          </div>
          <div className="sort">
            <div className="select-container">
              <span>Sort:</span>
              <select value={this.state.sort} onChange={this.handleSort}>
                <option value="Default">Default</option>
                <option value="New">New</option>
                <option value="Game">Game</option>
                <option value="Players">Players</option>
              </select>
            </div>
          </div>
        </div>
        <Rooms socket={this.props.socket} rooms={queriedRooms}></Rooms>
      </div>
    )
  }
};

export default QueriedRooms;
