import React from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import "./Login.css";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      login: {
        username: "",
        password: ""
      },
      register: {
        username: "",
        email: "",
        password: ""
      }
    };
    this.container = React.createRef();
    this.viewSignIn = this.viewSignIn.bind(this);
    this.viewSignUp = this.viewSignUp.bind(this);
    this.handleLoginUsername = this.handleLoginUsername.bind(this);
    this.handleLoginPassword = this.handleLoginPassword.bind(this);
    this.handleRegisterUsername = this.handleRegisterUsername.bind(this);
    this.handleRegisterEmail = this.handleRegisterEmail.bind(this);
    this.handleRegisterPassword = this.handleRegisterPassword.bind(this);
    this.handleRecovery = this.handleRecovery.bind(this);
    this.handleSocial = this.handleSocial.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  viewSignUp() {
    this.container.current.classList.add("toggle");
    this.setState({status: ""});
  }

  viewSignIn() {
    this.container.current.classList.remove("toggle");
    this.setState({status: ""});
  }

  handleLoginUsername(event) {
    this.setState({login: {...this.state.login, username: event.target.value}});
  }

  handleLoginPassword(event) {
    this.setState({login: {...this.state.login, password: event.target.value}});
  }

  handleRegisterUsername(event) {
    this.setState({register: {...this.state.register, username: event.target.value}});
  }

  handleRegisterEmail(event) {
    this.setState({register: {...this.state.register, email: event.target.value}});
  }

  handleRegisterPassword(event) {
    this.setState({register: {...this.state.register, password: event.target.value}});
  }

  handleRecovery(event) {
    event.preventDefault();
  }

  handleSocial(event) {
    event.preventDefault();
  }

  handleSignUp(event) {
    event.preventDefault();
    if (this.state.register.username.length === 0 || this.state.register.password.length === 0 || !/\S+@\S+\.\S+/.test(this.state.register.email)) {
      this.setState({status: "You did not enter a username, password, and a valid email address."});
      return;
    }
    fetch("/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(this.state.register)
    }).then(response => response.json())
    .then(data => {
      this.setState({status: data.status});
      if (data.status === "Registration Successful.") this.props.history.push("/lobby");
    });
  }

  handleSignIn(event) {
    event.preventDefault();
    if (this.state.login.username.length === 0 || this.state.login.password.length === 0) {
      this.setState({status: "You did not enter a username or password."});
        return;
      }
      fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state.login)
      }).then(response => response.json())
      .then(data => {
        this.setState({status: data.status});
        if (data.status === "Login Successful.") this.props.history.push("/lobby");
      });
  }

  render() {
    return (
      <div className="container" id="login" ref={this.container}>
        <div className="form-container sign-in-container">
          <form onSubmit={this.handleSignIn}>
            <h1>Login</h1>
            <div className="social-container">
              <button className="social facebook" onClick={this.handleSocial}></button>
              <button className="social google" onClick={this.handleSocial}></button>
              <button className="social twitter" onClick={this.handleSocial}></button>
            </div>
            <span>or use your account</span>
            <InputGroup>
              <InputGroup.Prepend>
                <button className="input-group-prepend-icon username" disabled></button>
              </InputGroup.Prepend>
              <FormControl className="input-group-text"
                type="text"
                placeholder="Username"
                value={this.state.login.username}
                onChange={this.handleLoginUsername}
                aria-label="Username"
                aria-describedby="Username"
              />
            </InputGroup>
            <InputGroup>
              <InputGroup.Prepend>
              <button className="input-group-prepend-icon password" disabled></button>
              </InputGroup.Prepend>
              <FormControl className="input-group-text"
                type="password"
                placeholder="Password"
                value={this.state.login.password}
                onChange={this.handleLoginPassword}
                aria-label="Password"
                aria-describedby="Password"
              />
            </InputGroup>
            <span className="sign-status">{this.state.status}</span>
            <a href="/recovery">Forgot your password?</a>
            <button className="sign-btn">Sign In</button>
          </form>
        </div>
        <div className="form-container sign-up-container">
          <form onSubmit={this.handleSignUp}>
            <h1>Registration</h1>
            <div className="social-container">
              <button className="social facebook" onClick={this.handleSocial}></button>
              <button className="social google" onClick={this.handleSocial}></button>
              <button className="social twitter" onClick={this.handleSocial}></button>
            </div>
            <span>or use your email</span>
            <InputGroup>
              <InputGroup.Prepend>
                <button className="input-group-prepend-icon username" disabled></button>
              </InputGroup.Prepend>
              <FormControl className="input-group-text"
                type="text"
                placeholder="Username"
                value={this.state.register.username}
                onChange={this.handleRegisterUsername}
                aria-label="Username"
                aria-describedby="Username"
              />
            </InputGroup>
            <InputGroup>
              <InputGroup.Prepend>
              <button className="input-group-prepend-icon password" disabled></button>
              </InputGroup.Prepend>
              <FormControl className="input-group-text"
                type="password"
                placeholder="Password"
                value={this.state.register.password}
                onChange={this.handleRegisterPassword}
                aria-label="Password"
                aria-describedby="Password"
              />
            </InputGroup>
            <InputGroup>
              <InputGroup.Prepend>
              <button className="input-group-prepend-icon email" disabled></button>
              </InputGroup.Prepend>
              <FormControl className="input-group-text"
                type="text"
                placeholder="Email"
                value={this.state.register.email}
                onChange={this.handleRegisterEmail}
                aria-label="Email"
                aria-describedby="Email"
              />
            </InputGroup>
            <span className="sign-status">{this.state.status}</span>
            <button className="sign-btn">Sign Up</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Hello, Stranger!</h1>
              <p>Create your account to start playing our collection of free games.</p>
              <span>Already have an account?</span>
              <button className="sign-btn ghost" id="signIn" onClick={this.viewSignIn}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Welcome Back!</h1>
              <p>Enter your credentials to jump right back into the action.</p>
              <span>Don't have an account yet?</span>
              <button className="sign-btn ghost" id="signUp" onClick={this.viewSignUp}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export default Login;
