import React, { Component } from "react";

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errorMessage: "",
    };
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  

  login() {
    
    const headers = {
      "Content-Type": "application/json",
    };
    if (this.props.logged_in) {
      let csrftoken;
      const csrfCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken"));
      if (csrfCookie) {
        csrftoken = csrfCookie.split("=")[1];
      }
      headers["X-CSRFToken"] = csrftoken;
    }
    fetch("/api/login/", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        "username": this.state.username,
        "password": this.state.password
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw errorData
        } else {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        this.props.history.push("/")
        this.setState({ errorMessage: "" });
      })
      .catch((errorData) => {
        console.log(errorData);
        this.setState({ errorMessage: errorData.error});
      });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const styles = {
        width: "600px"
    }
    return (
      <div className="registration-page-wrapper">
        <div className="box-element" style={styles}>
          <div className="register-form-container">
            <input
              className="register-form-input"
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
              value={this.state.username}
            />
            <input
              className="register-form-input"
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
              value={this.state.password}
            />
            
            <button id="register-submit-button" onClick={this.login}>Sign In</button>
            <p className="message">
              Don't have an account? <a href="/register">Create An Account</a>
            </p>
            {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
          </div>
        </div>
      </div>
    );
  }
}
