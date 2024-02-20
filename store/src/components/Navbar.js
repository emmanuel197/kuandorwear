import React, { Component } from "react";
import cartIcon from "../../static/images/cart.png";
import { logout } from "../actions/auth";
import { connect } from "react-redux";
import { getCookie } from "../util";
import { cookieCart } from "../cart";
import kuandohWearLogo from "../../static/images/KuandorWear-logo4.png";
import AlertContext from './AlertContext';
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalItems: 0,
      orderComplete: this.props.orderComplete,
      cartUpdated: this.props.cartUpdated,
    };
    this.logOutHandler = this.logOutHandler.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  async fetchData() {
    console.log(this.props.isAuthenticated);
    if (this.props.isAuthenticated) {
      const jwtToken = localStorage.getItem("access");

      fetch("/api/cart-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
          Authorization: `JWT ${jwtToken}`,
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
          this.setState({
            totalItems: this.state.orderComplete ? 0 : data.total_items,
          });
        })
        .catch((errorData) => {
          console.log(errorData);
          this.setState({
            totalItems: 0,
          });
        });
    } else {
      console.log("cookieCart");
      const { total_items } = await cookieCart.call(this);
      this.setState({
        totalItems: this.state.orderComplete ? 0 : total_items,
      });
      console.log(total_items);
    }
  }

  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps) {
    // Check if the 'logged_in' prop has changed
    if (this.props.cart_total_updated) {
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

  static contextType = AlertContext;
  
  render() {
    const username = this.props.user ? this.props.user.username : "Guest";
    const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);
    const { alertMessage, setAlertMessage } = this.context;
    
    console.log(alertMessage)
    return (
      <div>
        <nav className="store-nav">
      <div className="wrapper">
        <div className="logo"><a href="/"><img src={kuandohWearLogo}/></a></div>
        <input type="radio" name="slider" id="menu-btn"/>
        <input type="radio" name="slider" id="close-btn"/>
        <ul className="nav-links">
          <label for="close-btn" className="btn close-btn"><i class="fas fa-times"></i></label>
          <li><a href="/">Store</a></li>
          <li><a href="/about">About</a></li>
          {this.props.isAuthenticated ? (
              <li><a
                href="/"
                onClick={this.logOutHandler}
              >
                Logout
              </a></li>
            ) : (
              <li><a href="/login">Login</a></li>
            )}
          <li>
            <a href="/cart" id="cart-link">
                <img id="cart-icon" src={cartIcon}/>
                <p id="cart-total" className="badge align-text-center">{this.state.totalItems}</p>
                </a>
          </li>
        </ul>
        <label for="menu-btn" class="btn menu-btn"><i class="fas fa-bars"></i></label>
      </div>
        </nav>
        {alertMessage && (
          <div className="alert btn-color alert-dismissible fade show mb-0" role="alert">
          {alertMessage}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
    </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(NavBar);
