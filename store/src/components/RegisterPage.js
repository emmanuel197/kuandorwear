import React, { Component } from "react";
import { signup } from "../actions/auth";
import { connect } from "react-redux";
import AlertContext from './AlertContext';
class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password1: "",
      password2: "",
      first_name: "",
      last_name: "",
      email: "",
      accountCreated: false,
      showError: false
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

static contextType = AlertContext;

async register() {
     await this.props.signup(
        this.state.username,
        this.state.email,
        this.state.password1,
        this.state.password2,
        this.state.first_name,
        this.state.last_name
      )
      this.context.setAlertMessage('You have successfully signed up! Check your email to verify your account.');
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
          <div className="form-outline mb-4">
          <input
              className="form-control"
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
              value={this.state.username}
            />
          </div>
          <div className="form-outline mb-4">
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Email"
              onChange={this.handleChange}
              value={this.state.email}
            />
            </div>
            <div className="form-outline mb-4">
            <input
              className="form-control"
              type="password"
              name="password1"
              placeholder="Password"
              onChange={this.handleChange}
              value={this.state.password1}
            />
            </div>
            <div className="form-outline mb-4">
            <input
              className="form-control"
              type="password"
              name="password2"
              placeholder="Confirm Password"
              onChange={this.handleChange}
              value={this.state.password2}
            />
            </div>
            <div className="form-outline mb-4">
            <input
              className="form-control"
              type="text"
              name="first_name"
              placeholder="First Name"
              onChange={this.handleChange}
              value={this.state.first_name}
            />
            </div>
            <div className="form-outline mb-4">
            <input
              className="form-control"
              type="text"
              name="last_name"
              placeholder="Last Name"
              onChange={this.handleChange}
              value={this.state.last_name}
            />
            </div>
            <button className="mb-2" id="register-submit-button" onClick={this.register}>
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
                  className="btn-close"
                  data-bs-dismiss="alert"
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
