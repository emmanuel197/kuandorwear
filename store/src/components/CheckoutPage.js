import React, { Component } from "react";
import placeHolderImage from "../../static/images/placeholder.png";
export default class CheckoutPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipcode: ""
    };
  

    this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    console.log(this.state.email);
  }
   
  // handleSubmit(event) {
  //   event.preventDefault();

  //   const formData = {
  //       name: this.state.name,
  //       email: this.state.email,
  //   }
  //   requestOptions = {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(formData)
  //   }
  //   fetch("", requestOptions)
  //   .then(response )
  // }
  render() {
    return (
      <div className="row">
        <div className="col-lg-6">
          <div className="box-element" id="form-wrapper">
            <form>
              <div id="user-info">
                <div className="form-field">
                  <input
                    required
                    className="form-control"
                    type="text"
                    name="name"
                    placeholder="Name.."
                    value={this.state.name}
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
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            
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
                  />
                </div>
                <div className="form-field">
                  <input
                    className="form-control"
                    type="text"
                    name="city"
                    placeholder="City.."
                  />
                </div>
                <div className="form-field">
                  <input
                    className="form-control"
                    type="text"
                    name="state"
                    placeholder="State.."
                  />
                </div>
                <div className="form-field">
                  <input
                    className="form-control"
                    type="text"
                    name="zipcode"
                    placeholder="Zip code.."
                  />
                </div>
              </div>
              <hr />
              <button
                id="form-button"
                className="btn btn-success btn-block"
                
              >Continue</button>
            </form>
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
            <div className="cart-row">
              <div style={{ flex: "2" }}>
                <img
                  className="row-image"
                  src={placeHolderImage}
                />
              </div>
              <div style={{ flex: "2" }}>
                <p>Product 1</p>
              </div>
              <div style={{ flex: "1" }}>
                <p>$20.00</p>
              </div>
              <div style={{ flex: "1" }}>
                <p>x2</p>
              </div>
            </div>
            <h5>Items: 2</h5>
            <h5>Total: $40</h5>
          </div>
        </div>
      </div>
    );
  }
}
