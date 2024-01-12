import React, { Component } from "react";
// import axios from 'axios';
import { login } from '../actions/auth';
import { connect } from "react-redux";
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: "",
      logged_in: this.props.logged_in
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.logged_in !== this.props.logged_in) {
      this.setState({logged_in: this.props.logged_in})
    }
  }

  onSubmit() {
    this.props.login(this.state.email, this.state.password);
    document.cookie = 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    console.log("Submitted");
    

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
            
            <button id="register-submit-button" onClick={this.onSubmit}>Sign In</button>
            <p className="message">
              Don't have an account? <a href="/register">Create An Account</a>
            </p>
            <p className="message">
              Forgot your Password? <a href="/reset-password">Reset Password</a>
            </p>
            {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(LoginPage);
