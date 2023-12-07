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
      formErrors: {},
    };
    this.register = this.register.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  register() {
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
    fetch("/api/register/", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        username: this.state.username,
        password1: this.state.password1,
        password2: this.state.password2,
        email: this.state.email,
        name: this.state.name,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json(); // Assuming error response contains JSON data
          throw errorData; // Throw the errorData
        } else {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        this.props.history.push("/login");
        this.setState({ formErrors: {} });
      })
      .catch((errorData) => {
        console.log(errorData.form_errors);
        this.setState({ formErrors: errorData.form_errors });
      });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const styles = {
      width: "600px",
    };
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
            <button id="register-submit-button" onClick={this.register}>
              Register
            </button>
            <p className="message">
              Already registered? <a href="/login">Sign In</a>
            </p>
            {this.state.formErrors &&
              Object.keys(this.state.formErrors).map((key, i) => (
                <p key={i}>
                  {this.state.formErrors[key]}
                </p>
              ))}
          </div>
        </div>
      </div>
    );
  }
}
