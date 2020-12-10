import React from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import "./App.css";
import Lobby from "./Lobby/Lobby";
import Login from "./Login/Login";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Lobby}/>
        <Route exact path="/login" component={Login}/>
        <Redirect from="*" to="/"></Redirect>
      </Switch>
    </Router>
  );
}

export default App;
