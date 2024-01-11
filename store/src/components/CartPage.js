import React, { Component } from "react";
import arrowUp from "../../static/images/arrow-up.png";
import arrowDown from "../../static/images/arrow-down.png";
import CartProduct from "./CartProduct";
import { connect } from "react-redux";
import { addCookieItem, addOrRemoveItemHandler } from "../cart";
import { getCookie  } from "../util";
class CartPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_items: 0,
      total_cost: 0,
      item_list: [],
      cartUpdated: this.props.cartUpdated
    };
    this.updateCart = this.updateCart.bind(this)
  }
  
updateCart(action, product_id) {
  console.log(this.props.isAuthenticated)
  console.log(product_id)
  if (this.props.isAuthenticated){
    addOrRemoveItemHandler.call(this, action, product_id);
  }else{
    addCookieItem(action, product_id)
  }
}

  fetchData() {
    const jwtToken = localStorage.getItem('access');
    const requestOptions = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
        'Authorization': `JWT ${jwtToken}`
    }}
    fetch("/api/cart-data", requestOptions)
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
  componentDidMount() { 
    console.log(this.state.cartUpdated)
    this.fetchData()
  }
  
  componentDidUpdate(prevProps) {
    // Check if the cartUpdated prop has changed
    if (prevProps.cartUpdated !== this.props.cartUpdated) {
      this.fetchData()
      this.setState({ cartUpdated: this.props.cartUpdated });
    }
  }
  render() {
    const styles = {
      float: "right",
      margin: "5px",
    };
    const cartProducts = this.state.item_list.map((item) => (
      <CartProduct
        id={item.id}
        name={item.product}
        price={item.price}
        image={item.image}
        quantity={item.quantity}
        total={item.total}
        updateCart={(action, product_id) => this.updateCart(action, product_id)}
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

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});


export default connect(mapStateToProps, null)(CartPage)