import React, { Component } from "react";
import placeHolderImage from "../../static/images/placeholder.png";
import CheckoutProduct from "./CheckoutProduct";
export default class CheckoutPage extends Component {
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
      },
      total_items: 0,
      total_cost: 0,
      item_list: [],
      shipping: false,
      anonymousUser: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.processOrder = this.processOrder.bind(this);
  }
  componentDidMount() {
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
    fetch("/api/cart-data", {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        this.setState({
          total_items: data.total_items,
          total_cost: data.total_cost,
          item_list: data.items,
          shipping: data.shipping,
          anonymousUser: data.anonymous_user,
        });
      });
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
  processOrder() {
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
    const requestOptions = {
      method: "POST",
      headers: headers,
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
          console.log(data);
          window.location.replace("/");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const checkoutProducts = this.state.item_list.map((item) => (
      <CheckoutProduct
        name={item.product}
        image={item.image}
        quantity={item.quantity}
        total={item.total}
      />
    ));
    const { name, email } = this.state.userInfo;
    const { address, city, state, zipcode } = this.state.shippingInfo;
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
                </div>
              )}
              <hr />
              <button
                id="form-button"
                className="btn btn-success btn-block"
                onClick={() => this.processOrder()}
              >
                Continue
              </button>
            </div>
          </div>
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
