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
         
          {/* <li>
            <a href="#" className="desktop-item">Dropdown Menu</a>
            <input type="checkbox" id="showDrop"/>
            <label for="showDrop" className="mobile-item">Dropdown Menu</label>
            <ul class="drop-menu">
              <li><a href="#">Drop menu 1</a></li>
              <li><a href="#">Drop menu 2</a></li>
              <li><a href="#">Drop menu 3</a></li>
              <li><a href="#">Drop menu 4</a></li>
            </ul>
          </li> */}
          {/* <li>
            <a href="#" class="desktop-item">Mega Menu</a>
            <input type="checkbox" id="showMega"/>
            <label for="showMega" class="mobile-item">Mega Menu</label>
            <div class="mega-box">
              <div class="content">
                <div class="row">
                  <img src="https://fadzrinmadu.github.io/hosted-assets/responsive-mega-menu-and-dropdown-menu-using-only-html-and-css/img.jpg" alt=""/>
                </div>
                <div class="row">
                  <header>Design Services</header>
                  <ul class="mega-links">
                    <li><a href="#">Graphics</a></li>
                    <li><a href="#">Vectors</a></li>
                    <li><a href="#">Business cards</a></li>
                    <li><a href="#">Custom logo</a></li>
                  </ul>
                </div>
                <div class="row">
                  <header>Email Services</header>
                  <ul class="mega-links">
                    <li><a href="#">Personal Email</a></li>
                    <li><a href="#">Business Email</a></li>
                    <li><a href="#">Mobile Email</a></li>
                    <li><a href="#">Web Marketing</a></li>
                  </ul>
                </div>
                <div class="row">
                  <header>Security services</header>
                  <ul class="mega-links">
                    <li><a href="#">Site Seal</a></li>
                    <li><a href="#">VPS Hosting</a></li>
                    <li><a href="#">Privacy Seal</a></li>
                    <li><a href="#">Website design</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </li> */}
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
