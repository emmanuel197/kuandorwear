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
      cartUpdated: false
    };
    this.updatedToggler = this.updatedToggler.bind(this);
    this.cartUpdatedToggler = this.cartUpdatedToggler.bind(this)
    this.loggedToggler = this.loggedToggler.bind(this)
    this.loggedToggler()
  }
  updatedToggler() {
    this.setState((prevState) => {
      return {
        ...prevState,
        cart_total_updated: !prevState.cart_total_updated,
      };
    });
  }
  cartUpdatedToggler() {
    this.setState((prevState) => (
      {...prevState, cartUpdated: !prevState.cartUpdated}
      ))
  }


  loggedToggler() {
    fetch("/api/check-auth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
    },
    })
      .then((response) => {
          return response.json();
         })
      .then((data) => {
        console.log(data);
       if (data.logged_in) {this.setState((prevState) => {
          return {
            ...prevState,
              logged_in: true,
          } 
        
        });}
        else  {this.setState((prevState) => {
          return {
            ...prevState,
            logged_in: false,
          } 
        });}
      })
     
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if the logged_in state has changed
    if (prevState.logged_in !== this.state.logged_in) {
      // Perform actions or additional state updates if needed
      // ...
      console.log("Logged in status changed:", this.state.logged_in);
    }
  }

 
 
  


  render() {
    console.log(this.state.logged_in)
    return (
      <div>
          <Homepage
            logged_in={this.state.logged_in}
            cart_total_updated={this.state.cart_total_updated}
            updatedToggler={this.updatedToggler}
            cartUpdatedToggler={() => {this.cartUpdatedToggler()}}
            cartUpdated={this.state.cartUpdated}
          /> 
      </div>
    );
  }
}

const root = document.getElementById("app");
ReactDOM.render(<App />, root);
