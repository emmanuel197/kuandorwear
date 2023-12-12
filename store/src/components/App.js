import React, { Component } from "react";
import ReactDOM from "react-dom";
import NavBar from "./Navbar";
import Homepage from "./Homepage";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: false,
      cart_total_updated: false,
    };
    this.updatedToggler = this.updatedToggler.bind(this);
  }
  updatedToggler() {
    this.setState((prevState) => {
      return {
        ...prevState,
        cart_total_updated: !prevState.cart_total_updated,
      };
    });
  }
//   loggedToggler() {
//     this.setState((prevState) => {
//       return {
//         ...prevState,
//         logged_in: !prevState.logged_in,
//       };
//     });
//   }
  componentDidMount() {
    const headers = {
      "Content-Type": "application/json",
    };
    if (this.props.logged_in) {
      const csrftoken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken"))
        .split("=")[1];
      headers["X-CSRFToken"] = csrftoken;
    }
    // Check authentication status
    fetch("/api/check-auth/", {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          // User is not authenticated
          this.setState({ logged_in: false });
        } else {
          // User is authenticated
          this.setState({ logged_in: true });
        }
      })
      .catch((error) => {
        console.error(`Fetch Error =\n`, error);
        this.setState({ logged_in: false });
      });
  }

  render() {
    // console.log(this.state.logged_in)
    return (
      <div>
          <Homepage
            logged_in={this.state.logged_in}
            cart_total_updated={this.state.cart_total_updated}
            updatedToggler={this.updatedToggler}
          /> 
      </div>
    );
  }
}

const root = document.getElementById("app");
ReactDOM.render(<App />, root);
