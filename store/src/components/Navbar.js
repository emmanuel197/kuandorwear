import React, { Component } from "react";
import { Link } from "react-router-dom";
import cartIcon from "../../static/images/cart.png";
import { logout } from "../actions/auth";
import { connect } from "react-redux";
import { getCookie } from "../util";
import { cookieCart } from "../cart";
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalItems: 0,
      orderComplete: this.props.orderComplete,
      cartUpdated: this.props.cartUpdated,
      logged_in: this.props.logged_in,
    };
    this.logOutHandler = this.logOutHandler.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  async fetchData() {
    console.log(this.props.isAuthenticated)
    if (this.props.isAuthenticated) {
      const jwtToken = localStorage.getItem("access");

      fetch("/api/cart-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
          "Authorization": `JWT ${jwtToken}`,
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json(); // Assuming error response contains JSON data
            throw errorData; // Throw the errorData
          } else {
            return response.json();
          }
        })
        .then((data) => {
          // console.log(data);
          this.setState({
            totalItems: this.state.orderComplete ? 0 : data.total_items,
          });
        })
        .catch((errorData) => console.log(errorData));
    }  else {
          console.log('cookieCart')
         const { total_items } = await cookieCart.call(this)
         this.setState({
           totalItems: this.state.orderComplete ? 0 : total_items,
         });
         console.log(total_items)
     }
  }

  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps) {
    // Check if the 'logged_in' prop has changed
    if (this.props.cart_total_updated) {
      // console.log("yeah");
      this.fetchData();
      this.props.updatedToggler();
    }
    if (prevProps.cartUpdated !== this.props.cartUpdated) {
      this.fetchData();
      this.setState({ cartUpdated: this.props.cartUpdated });
    }
    if (prevProps.isAuthenticated !== this.props.isAuthenticated) {
      this.fetchData();
    }
  }

  logOutHandler() {
    this.props.logout();
    this.props.history.push("/");
  }
  render() {
    // console.log(this.props.isAuthenticated);
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
            {this.props.isAuthenticated ? (
              <a
                href="/"
                className="btn btn-warning"
                onClick={this.logOutHandler}
              >
                Logout
              </a>
            ) : (
              <a href="/login" className="btn btn-warning">
                Login
              </a>
            )}
            <a href="/cart">
              <img id="cart-icon" src={cartIcon} />
            </a>
            <p id="cart-total">{this.state.totalItems}</p>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logout })(NavBar);
