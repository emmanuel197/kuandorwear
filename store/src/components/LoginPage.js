import React, { Component } from "react";
// import axios from 'axios';
import { login } from "../actions/auth";
import { connect } from "react-redux";
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: "",
      showError: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.formErrors !== prevProps.formErrors) {
      this.setState({ showError: true });
    }
  }
  handleClose() {
    this.setState({ showError: false });
  };

  async onSubmit() {
    // this.props.login(this.state.email, this.state.password);
    // document.cookie = 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // console.log("Submitted");
    try {
      await this.props.login(this.state.email, this.state.password);
      document.cookie = "cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log("Submitted");
      this.props.history.push('/')
    } catch (error) {
      console.log(`error response: ${error.response}`);
      if (error.response && error.response.data) {
        this.setState({
          errorMessage: error.response.data.non_field_errors.join(", "),
        });
        console.log(
          `errorMessage: ${error.response.data.non_field_errors.join(", ")}`
        );
      } else {
        this.setState({ errorMessage: "Invalid username or password" });
      }
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      errorMessage: "",
    });
  }

  render() {
    console.log(this.props.formErrors);
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

            <button id="register-submit-button" onClick={this.onSubmit}>
              Sign In
            </button>
            <p className="message">
              Don't have an account? <a href="/register">Create An Account</a>
            </p>
            <p className="message">
              Forgot your Password? <a href="/reset-password">Reset Password</a>
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
  formErrors: state.auth.formErrors,
});

export default connect(mapStateToProps, { login })(LoginPage);
