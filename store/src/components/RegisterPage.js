import React, { Component } from "react";

export default class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password1: "",
      password2: "",
      name: "",
      email: "",
      errorMessage: "",
    };
    this.register = this.register.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  register() {
    // Confirm password
    if (this.state.password1 !== this.state.password2) {
      this.setState({ errorMessage: "Passwords do not match" });
      return;
    }
    const csrftoken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken"))
      .split("=")[1];

    fetch("/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
      body: JSON.stringify({
        username: this.state.username,
        password1: this.state.password1,
        password2: this.state.password2,
        email: this.state.email,
        name: this.state.name,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        this.props.history.push("/login")
        this.setState({ errorMessage: "" });
      })
      .catch((error) => {
        console.error(`Fetch Error =\n`, error);
        this.setState({ errorMessage: "An error occurred" });
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
              type="email"
              name="email"
              placeholder="Email"
              onChange={this.handleChange}
              value={this.state.email}
            />
            <input
              className="register-form-input"
              type="password"
              name="password1"
              placeholder="Password"
              onChange={this.handleChange}
              value={this.state.password1}
            />
            <input
              className="register-form-input"
              type="password"
              name="password2"
              placeholder="Confirm Password"
              onChange={this.handleChange}
              value={this.state.password2}
            />
            <input
              className="register-form-input"
              type="text"
              name="name"
              placeholder="Name"
              onChange={this.handleChange}
              value={this.state.name}
            />
            <button id="register-submit-button" onClick={this.register}>Register</button>
            <p className="message">
              Already registered? <a href="/login">Sign In</a>
            </p>
            {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
          </div>
        </div>
      </div>
    );
  }
}
