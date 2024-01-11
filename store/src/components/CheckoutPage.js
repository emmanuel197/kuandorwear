import React, { Component } from "react";
import placeHolderImage from "../../static/images/placeholder.png";
import CheckoutProduct from "./CheckoutProduct";
import { connect } from "react-redux";
import { getCookie } from "../util";
class CheckoutPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: {
        name: "",
        email: "",
      },
      shippingInfo: {
        address: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
      },
      total_items: 0,
      total_cost: 0,
      item_list: [],
      shipping: false,
      anonymousUser: false,
      formButtonClicked: false,
      // orderComplete: this.props.orderComplete
    };

    this.handleChange = this.handleChange.bind(this);
    this.onFormButtonClick = this.onFormButtonClick.bind(this)
    this.processOrder = this.processOrder.bind(this);
    this.renderPaypalButtons = this.renderPaypalButtons.bind(this);
  }
  componentDidMount() {
    // console.log(this.state.orderComplete)
    fetch("/api/cart-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data.order_status);
        this.setState({
          total_items: this.state.orderComplete ? 0 : data.total_items,
          total_cost: this.state.orderComplete ? 0 : data.total_cost,
          item_list: this.state.orderComplete ? 0 : data.items,
          shipping: data.shipping,
          anonymousUser: this.props.isAuthenticated,
        });
      });
  }

  processOrder() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        total: this.state.total_cost,
        user_info: this.state.userInfo,
        shipping_info: this.state.shippingInfo,
      }),
    };
    fetch("/api/process-order/", requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.redirect) {
          // Redirect to the registration page
          console.log("redirect");
          window.location.href = data.redirect;
        } else {
          console.log(data.order_status);
          // if (data.order_status) {
          //   this.props.orderStatusToggler()
          // }
          window.location.replace('/')
          
         
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  renderPaypalButtons() {
    // Render PayPal buttons here
    const total = `${this.state.total_cost}`
    const processOrder = this.processOrder;

    paypal
      .Buttons({
        style: {
          color:  'blue',
          shape:  'rect',
      },
        // Call your server to set up the transaction
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value:parseFloat(total).toFixed(2),
                },
              },
            ],
          });
        },

        // Call your server to finalize the transaction

        // Finalize the transaction
        onApprove: function (data, actions) {
          return actions.order.capture().then((details) => {
            // Show a success message to the buyer
           processOrder()
          });
        },
      })
      .render("#paypal-button-container");
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      userInfo: {
        ...prevState.userInfo,
        [name]: value,
      },
      shippingInfo: {
        ...prevState.shippingInfo,
        [name]: value,
      },
    }));
  }
  onFormButtonClick() {
    this.setState({ formButtonClicked: true })
  }
  

  render() {
    if (this.state.formButtonClicked) {
      const script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=AXZcDTvdaIqs36jgbZNz8h_N_f8GYo8uhVamcgiwK0__pvP8ftifpCK94lVnve8uDfBTW3QSV1sS5PJB&currency=USD&disable-funding=credit";
      script.async = true;
      script.onload = () => {
        this.renderPaypalButtons();
      };
      document.body.appendChild(script);
    }
    const checkoutProducts = this.state.item_list.map((item) => (
      <CheckoutProduct
        name={item.product}
        image={item.image}
        quantity={item.quantity}
        total={item.total}
      />
    ));
    const { name, email } = this.state.userInfo;
    const { address, city, state, zipcode, country } = this.state.shippingInfo;
    return (
      <div className="row">
        <div className="col-lg-6">
          <div className="box-element" id="form-wrapper">
            <div>
              {this.state.anonymousUser && (
                <div id="user-info">
                  <div className="form-field">
                    <input
                      required
                      className="form-control"
                      type="text"
                      name="name"
                      placeholder="Name.."
                      value={name}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-field">
                    <input
                      required
                      className="form-control"
                      type="email"
                      name="email"
                      placeholder="Email.."
                      value={email}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              )}

              {this.state.shipping && (
                <div id="shipping-info">
                  <hr />
                  <p>Shipping Information:</p>
                  <hr />
                  <div className="form-field">
                    <input
                      className="form-control"
                      type="text"
                      name="address"
                      placeholder="Address.."
                      value={address}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-field">
                    <input
                      className="form-control"
                      type="text"
                      name="city"
                      placeholder="City.."
                      value={city}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-field">
                    <input
                      className="form-control"
                      type="text"
                      name="state"
                      placeholder="State.."
                      value={state}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-field">
                    <input
                      className="form-control"
                      type="text"
                      name="zipcode"
                      placeholder="Zip code.."
                      value={zipcode}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-field">
                    <input
                      className="form-control"
                      type="text"
                      name="country"
                      placeholder="Country.."
                      value={country}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              )}
              <hr />
              {this.state.formButtonClicked == false && (
                <button
                  id="form-button"
                  className="btn btn-success btn-block"
                  onClick={() => this.onFormButtonClick()}
                >
                  Continue
                </button>
              )}
            </div>
          </div>
          <br />
          {this.state.formButtonClicked && (
            <div class="box-element" id="payment-info">
              <small>Paypal Options</small>
              <div id="paypal-button-container"></div>
            </div>
          )}
        </div>

        <div className="col-lg-6">
          <div className="box-element">
            <a className="btn btn-outline-dark" href="/cart">
              &#x2190; Back to Cart
            </a>
            <hr />
            <h3>Order Summary</h3>
            <hr />
            {checkoutProducts}
            <h5>Items: {this.state.total_items}</h5>
            <h5>Total: ${this.state.total_cost}</h5>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(CheckoutPage);