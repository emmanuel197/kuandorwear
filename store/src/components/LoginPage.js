import React, { Component } from "react";

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: "",
      logged_in: this.props.logged_in
    };
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getCookie = this.getCookie.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.logged_in !== this.props.logged_in) {
      this.setState({logged_in: this.props.logged_in})
    }
  }

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

  login() {
    fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.getCookie("csrftoken")
    },
      body: JSON.stringify({
        "email": this.state.email,
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
        window.location.replace('/')
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
              name="email"
              placeholder="Email"
              onChange={this.handleChange}
              value={this.state.email}
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
