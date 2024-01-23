import React, { Component } from "react";
import { signup } from "../actions/auth";
import { connect } from "react-redux";
class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password1: "",
      password2: "",
      name: "",
      email: "",
      accountCreated: false,
      showError: false
      // formErrors: {},
    };
    this.register = this.register.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
  //   // Check if account has been created and perform redirection
    if (this.state.accountCreated && !prevState.accountCreated) {
      this.props.history.push("/login");
    }
    if (this.props.formErrors !== prevProps.formErrors) {
      this.setState({ showError: true });
    }
  }

  handleClose() {
    this.setState({ showError: false });
  };

async register() {
     await this.props.signup(
        this.state.username,
        this.state.email,
        this.state.password1,
        this.state.password2,
        this.state.name
      )
      console.log(this.props.formErrors)
    if (this.props.formErrors == null) {
      this.setState({ accountCreated: true });
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    console.log(this.state.accountCreated)
    const styles = {
      width: "600px",
    };
    return (
      <div className="registration-page-wrapper mt-5">
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
            {this.state.showError && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                <strong>Error!</strong>   {Object.keys(this.props.formErrors).map((key, i) => (
                  <p key={i}>{this.props.formErrors[key]}</p>
                ))}
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                  onClick={this.handleClose}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  formErrors: state.auth.formErrors
});



export default connect(mapStateToProps, { signup })(RegisterPage);
