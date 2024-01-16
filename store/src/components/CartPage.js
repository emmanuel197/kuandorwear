import React, { Component } from "react";
import arrowUp from "../../static/images/arrow-up.png";
import arrowDown from "../../static/images/arrow-down.png";
import CartProduct from "./CartProduct";
import { connect } from "react-redux";
import { addCookieItem, addOrRemoveItemHandler, cookieCart } from "../cart";
import { getCookie } from "../util";

class CartPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_items: 0,
      total_cost: 0,
      item_list: [],
      cartUpdated: this.props.cartUpdated
      
    };
    this.updateCart = this.updateCart.bind(this);
    this.fetchData = this.fetchData.bind(this)
    
  }

  

  updateCart(action, product_id) {
    
    console.log(this.props.isAuthenticated);
    // this.setState((prevState) => return {...prevState, isAuthenticated: this.props.isAuthenticated})
    console.log(product_id);
    if (this.props.isAuthenticated) {
      addOrRemoveItemHandler.call(this, action, product_id);
    } else {
      addCookieItem.call(this, action, product_id);
    }
  }

  
  
  async fetchData() {
      console.log("isAuthenticated: " + `${this.props.isAuthenticated}`)
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
        this.setState({
          total_items: data.total_items,
          total_cost: data.total_cost,
          item_list: data.items,
        });
      }).catch((errorData) => console.log(errorData))
       } else {
         console.log('cookieCart')
         const {total_items, total_cost, items} = await cookieCart.call(this)
    
         this.setState({
           total_items: total_items,
           total_cost: parseFloat(total_cost).toFixed(2),
           item_list: items,
         });
       }
    }
    componentDidMount() {
      this.setState({isAuthenticated: this.props.isAuthenticated})
      // console.log(`componentDidMount:isAuthenticated: ${this.props.isAuthenticated}`)
      this.fetchData()
    }

  componentDidUpdate(prevProps) {
    // Check if the cartUpdated prop has changed
    if (prevProps.cartUpdated !== this.props.cartUpdated) {
      this.fetchData();
      this.setState({ cartUpdated: this.props.cartUpdated });
    }
    if (prevProps.isAuthenticated !== this.props.isAuthenticated) {
      this.fetchData();
    }
  }
  render() {
    // console.log(this.state.total_cost)
    console.log(`render:isAuthenticated: ${this.props.isAuthenticated}`)
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
        total={parseFloat(item.total).toFixed(2)}
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

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, null)(CartPage);
