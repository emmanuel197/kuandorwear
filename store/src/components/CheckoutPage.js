import React, { Component } from "react";
import placeHolderImage from "../../static/images/placeholder.png";
import CheckoutProduct from "./CheckoutProduct";
export default class CheckoutPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipcode: "",
      total_items: 0,
      total_cost: 0,
      item_list: []
    };
  

    this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    fetch("/api/cart-data")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        this.setState({
          total_items: data.total_items,
          total_cost: data.total_cost,
          item_list: data.items,
        });
      });
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
    const checkoutProducts = this.state.item_list.map((item) => (
      <CheckoutProduct
      name={item.product}
      image={item.image}
      quantity={item.quantity}
      total={item.total}
      />
    ))
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
            {checkoutProducts}
            <h5>Items: {this.state.total_items}</h5>
            <h5>Total: ${this.state.total_cost}</h5>
          </div>
        </div>
      </div>
    );
  }
}
