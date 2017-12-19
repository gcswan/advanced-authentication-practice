import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import SignUpSignIn from "./SignUpSignIn";
import TopNavbar from "./TopNavbar";
import Secret from "./Secret";

class App extends Component {
  constructor() {
    super();
    this.state = {
      signUpSignInError: "",
      authenticated: localStorage.getItem("token") || false
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignUp(credentials) {
    const { username, password, confirmPassword } = credentials;
    if (!username.trim() || !password.trim() ) {
      this.setState({
        signUpSignInError: "Must Provide All Fields"
      });
    } else {

      fetch("/api/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(credentials)
      }).then((res) => {
        return res.json();
      }).then((data) => {
        const { token } = data;
        localStorage.setItem("token", token);
        this.setState({
          signUpSignInError: "",
          authenticated: token
        });
      });
    }
  }

  handleSignIn(credentials) {
    const { username, password } = credentials;
    fetch("api/signin", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(credentials)
    }).then((response) => {
      if(response.status === 401){
        this.setState({
          signUpSignInError: "401 -- The Login attempt was invalid"
        })

      }
    })
  }
  // ### Implement handleSignIn in App.js
  // * Need to do a fetch post to /signin 
  // * Code will probably almost the same as handleSignUp
  // * In the first fetch `then` there is a parameter for the `response`
  // * this object has a property called status
  // * If the value of status is 401 it means the login was invalid, setState for an error message
  // * Else just return JSON as normal


  handleSignOut() {
    localStorage.removeItem("token");
    this.setState({
      authenticated: false
    });
  }

  renderSignUpSignIn() {
    return (
      <SignUpSignIn 
        error={this.state.signUpSignInError} 
        onSignUp={this.handleSignUp}
        onSignIn={this.handleSignIn} 
      />
    );
  }

  renderApp() {
    return (
      <div>
        <Switch>
          <Route exact path="/" render={() => <h1>I am protected!</h1>} />
          <Route exact path="/secret" component={Secret} />
          <Route render={() => <h1>NOT FOUND!</h1>} />
        </Switch>
      </div>
    );
  }

  render() {
    console.log(this.props)
    let whatToShow = "";
    if (this.state.authenticated) {
      whatToShow = this.renderApp();
    } else {
      whatToShow = this.renderSignUpSignIn();
    }
       
    return (
      <BrowserRouter>
        <div className="App">
          <TopNavbar 
            showNavItems={this.state.authenticated} 
            onSignOut={this.handleSignOut} />
          {whatToShow}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
