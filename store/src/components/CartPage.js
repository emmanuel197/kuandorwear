import React, { Component } from "react";
import arrowUp from "../../static/images/arrow-up.png";
import arrowDown from "../../static/images/arrow-down.png";
import CartProduct from "./CartProduct";
export default class CartPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_items: 0,
      total_cost: 0,
      item_list: [],
    };
    this.addOrRemoveItemHandler = this.addOrRemoveItemHandler.bind(this);
  }

  addOrRemoveItemHandler(action, product_name) {
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
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        "action": action,
        "product_name": product_name
      })
    }
    fetch("/api/update-cart/", requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data)
      if (data.message === 'Cart updated successfully') {
        this.setState(prevState => ({
          item_list: prevState.item_list.filter(item => item.product !== product_name || item.quantity !== 0)
        }));
      }
      window.location.replace("/cart")
    })
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

  render() {
    const styles = {
      float: "right",
      margin: "5px",
    };
    const cartProducts = this.state.item_list.map((item) => (
      <CartProduct
        name={item.product}
        price={item.price}
        image={item.image}
        quantity={item.quantity}
        total={item.total}
        addOrRemoveItemHandler={(action, product_name) => this.addOrRemoveItemHandler(action, product_name)}
      />
    ));
    return (
      <div className="col-lg-12">
        <div className="box-element">
          <a className="btn btn-outline-dark" href="/">
            &#x2190; Continue Shopping
          </a>
          <br />
          <br />
          <table className="table">
            <tr>
              <th>
                <h5>
                  Items: <strong>{this.state.total_items}</strong>
                </h5>
              </th>
              <th>
                <h5>
                  Total:<strong> $ {this.state.total_cost}</strong>
                </h5>
              </th>
              <th>
                <a style={styles} className="btn btn-success" href="/checkout">
                  Checkout
                </a>
              </th>
            </tr>
          </table>
        </div>

        <br />
        <div className="box-element">
          <div className="cart-row">
            <div style={{ flex: "2" }}></div>
            <div style={{ flex: "2" }}>
              <strong>Item</strong>
            </div>
            <div style={{ flex: "1" }}>
              <strong>Price</strong>
            </div>
            <div style={{ flex: "1" }}>
              <strong>Quantity</strong>
            </div>
            <div style={{ flex: "1" }}>
              <strong>Total</strong>
            </div>
          </div>
          {cartProducts}
        </div>
      </div>
    );
  }
}
