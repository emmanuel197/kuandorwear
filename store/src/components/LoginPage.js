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

 async onSubmit() {
    // this.props.login(this.state.email, this.state.password);
    // document.cookie = 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // console.log("Submitted");
    try {
      await this.props.login(this.state.email, this.state.password);
      document.cookie = 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      console.log("Submitted");
    } catch (error) {
      console.log(`error response: ${error.response}`)
      if (error.response && error.response.data) {
        this.setState({ errorMessage: error.response.data.non_field_errors.join(", ") });
        console.log(`errorMessage: ${error.response.data.non_field_errors.join(", ")}`)
      } else {
        this.setState({ errorMessage: "Invalid username or password" });
      }
    }

  }

  handleChange(event) {
    // this.setState({ [event.target.name]: event.target.value });
    this.setState({ [event.target.name]: event.target.value, errorMessage: "" });
  }

  render() {
    console.log(this.props.formErrors)
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
            {this.props.formErrors && (
              <div className="error-message">
                {Object.keys(this.props.formErrors).map((key, i) => (
                  <p key={i}>{this.props.formErrors[key]}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    formErrors: state.auth.formErrors
});

export default connect(mapStateToProps, { login })(LoginPage);
