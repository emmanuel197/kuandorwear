import React, { Component } from "react";
import axios from 'axios';
import { login } from "../actions/auth";
import { connect } from "react-redux";
import AlertContext from './AlertContext';
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: "",
      showError: false,
      react_app_api_url: "https://kuandorwear.vercel.app"
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.formErrors !== prevProps.formErrors) {
      this.setState({ showError: true });
    }
  }
  handleClose() {
    this.setState({ showError: false });
  }

  static contextType = AlertContext;

  async onSubmit() {
    try {
      await this.props.login(this.state.email, this.state.password);
      this.context.setAlertMessage('You have successfully logged in');
      document.cookie = "cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log("Submitted");
      if (this.props.isAuthenticated) {
        this.props.history.push("/");

      }
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

  continueWithGoogle = async () => {
    
    try {
        const res = await axios.get(`auth/o/google-oauth2/?redirect_uri=${this.state.react_app_api_url}`)
        console.log(res)
        window.location.replace(res.data.authorization_url);
    } catch (err) {
        console.log(err)
    }
};

continueWithFacebook = async () => {
    try {
        const res = await axios.get(`auth/o/facebook/?redirect_uri=${this.state.react_app_api_url}/facebook`)

        window.location.replace(res.data.authorization_url);
    } catch (err) {

    }
};

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      errorMessage: "",
    });
  }

  render() {
    const styles = {
      width: "600px",
    };

    return (
      <div className="registration-page-wrapper mt-5">
        <div className="box-element" style={styles}>
          <div className="register-form-container">
            <div className="form-outline mb-4">
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Email address"
                onChange={this.handleChange}
                value={this.state.email}
              />
            </div>
            <div className="form-outline mb-4">
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
              value={this.state.password}
            />
            </div>
            
            <div className="row mb-2">
              <div className="col d-flex justify-content-center">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="form2Example31"
                    checked
                  />
                  <label class="form-check-label" for="form2Example31">
                    {" "}
                    Remember me{" "}
                  </label>
                </div>
              </div>

              <div className="col">
                <a href="/reset-password">Forgot password?</a>
              </div>
            </div>
            <button
              id="register-submit-button"
              className="mb-2"
              onClick={this.onSubmit}
            >
              Sign In
            </button>
            <div className="text-center">
              <p>
              Don't have an account? <a href="/register">Register</a>
              </p>
              <p>or sign up with:</p>
              <button
              id="continue-with-google"
              className="mb-2 rounded-2"
              onClick={this.continueWithGoogle}
            >
             Continue With Google
            </button>
            </div>
            {this.state.showError && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                <strong>Error!</strong>{" "}
                {Object.keys(this.props.formErrors).map((key, i) => (
                  <p key={i}>{this.props.formErrors[key]}</p>
                ))}
                <button
                  type="button"
                  className="btn-close"
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
