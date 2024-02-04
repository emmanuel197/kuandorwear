import React, { Component } from "react";
import axios from 'axios';
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
      react_app_api_url: "http://localhost:8000"
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

  async onSubmit() {
    // this.props.login(this.state.email, this.state.password);
    // document.cookie = 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // console.log("Submitted");
    try {
      await this.props.login(this.state.email, this.state.password);
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
        const res = await axios.get(`auth/o/google-oauth2/?redirect_uri=${this.state.react_app_api_url}/google`)
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
    // console.log(this.props.formErrors);
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
            {/* <p className="message">
              Don't have an account? <a href="/register">Create An Account</a>
            </p> */}
            <div className="text-center">
              <p>
              Don't have an account? <a href="/register">Register</a>
              </p>
              <p>or sign up with:</p>
              <button type="button" className="btn btn-link btn-floating mx-1" onClick={this.continueWithFacebook}>
                <i className="fab fa-facebook-f"></i>
              </button>

              <button type="button" className="btn btn-link btn-floating mx-1" onClick={this.continueWithGoogle}>
                <i className="fab fa-google"></i>
              </button>

              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-twitter"></i>
              </button>

              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-github"></i>
              </button>
            </div>
            {/* <p className="message">
              Forgot your Password? <a href="/reset-password">Reset Password</a>
            </p> */}
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
      //       <form className="box-element mt-5" style={styles}>

      //   <div class="form-outline register-form-container mb-4">
      //     <input type="email" id="form2Example1" class="form-control" />
      //     <label class="form-label" for="form2Example1">Email address</label>
      //   </div>

      //   <div class="form-outline mb-4">
      //     <input type="password" id="form2Example2" class="form-control" />
      //     <label class="form-label" for="form2Example2">Password</label>
      //   </div>

      //   <div class="row mb-4">
      //     <div class="col d-flex justify-content-center">

      //       <div class="form-check">
      //         <input class="form-check-input" type="checkbox" value="" id="form2Example31" checked />
      //         <label class="form-check-label" for="form2Example31"> Remember me </label>
      //       </div>
      //     </div>

      //     <div class="col">

      //       <a href="#!">Forgot password?</a>
      //     </div>
      //   </div>

      //   <button type="button" class="btn btn-primary btn-block mb-4">Sign in</button>

      //   <div class="text-center">
      //     <p>Not a member? <a href="#!">Register</a></p>
      //     <p>or sign up with:</p>
      //     <button type="button" class="btn btn-link btn-floating mx-1">
      //       <i class="fab fa-facebook-f"></i>
      //     </button>

      //     <button type="button" class="btn btn-link btn-floating mx-1">
      //       <i class="fab fa-google"></i>
      //     </button>

      //     <button type="button" class="btn btn-link btn-floating mx-1">
      //       <i class="fab fa-twitter"></i>
      //     </button>

      //     <button type="button" class="btn btn-link btn-floating mx-1">
      //       <i class="fab fa-github"></i>
      //     </button>
      //   </div>
      // </form>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  formErrors: state.auth.formErrors,
});

export default connect(mapStateToProps, { login })(LoginPage);
