import React, { Component } from "react";
import {
    Link
  } from 'react-router-dom'
import cartIcon from "../../static/images/cart.png"
export default class NavBar extends Component{
  constructor(props) {
    super(props);
    this.state = {
      totalItems: 0
    }
    this.logOutHandler = this.logOutHandler.bind(this)
    this.fetchData = this.fetchData.bind(this)
  }
  fetchData() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.props.logged_in) {
      const csrftoken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken"))
        .split("=")[1];
      headers['X-CSRFToken'] = csrftoken;
    }
    fetch('/api/cart-data', {
      method: "GET",
      headers: headers})
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.setState({totalItems: data.total_items})
    })
  }

  componentDidMount() {
    this.fetchData()
  }
  componentDidUpdate() {
    // Check if the 'logged_in' prop has changed
    if (this.props.cart_total_updated) {
      console.log('yeah')
      this.fetchData();
      this.props.updatedToggler();
    }
  }
 

  logOutHandler() {
    const headers = {
      "Content-Type": "application/json",
    };
    if (this.props.logged_in) {
      let csrftoken;
      const csrfCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken"));
      if (csrfCookie) {
        csrftoken = csrfCookie.split("=")[1];
      }
      headers["X-CSRFToken"] = csrftoken;
    }
    fetch('/api/logout/', {
      method: 'POST',
      headers: headers
      })
    .then(response => response.json())
    .then(data => {
          console.log(data);
          
          this.props.history.push("/");
          
          // You can add more code here to handle the response
      })
      .catch((error) => {
          console.error('Error:', error);
      });

  }
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="/">
          KuandorWear
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">
                Store <span className="sr-only">(current)</span>
              </a>
            </li>
          </ul>
          <div className="form-inline my-2 my-lg-0">
            {this.props.logged_in ? <a href="/" className="btn btn-warning" onClick={this.logOutHandler}>
              Logout
            </a> : <a href="/login" className="btn btn-warning">
              Login
            </a> 
            }
            <a href="/cart">
              <img id="cart-icon" src={cartIcon} />
            </a>
            <p id="cart-total">{this.props.logged_in ? this.state.totalItems : 0}</p>
          </div>
        </div>
      </nav>
    );
  }
}
