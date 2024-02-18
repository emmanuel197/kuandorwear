import React, { Component } from "react";
import arrowUp from "../../static/images/arrow-up.png";
import arrowDown from "../../static/images/arrow-down.png";
import CartProduct from "./CartProduct";
import { connect } from "react-redux";
import { addCookieItem, addOrRemoveItemHandler, cookieCart } from "../cart";
import { getCookie } from "../util";
import { Link } from 'react-router-dom';
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

  checkoutRedirect() {
    return window.location.replace("/checkout")
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
    const styles = {
      float: "right",
      margin: "5px",
    };
    
    const cartProducts = this.state.item_list.map((item, index) => {
      let position;
      if (index === 0) {
        position = 'first';
      } else if (index === this.state.item_list.length - 1) {
        position = 'last';
      } else {
        position = 'middle';
      }
      return <CartProduct
        id={item.id}
        position={position}
        name={item.product}
        price={item.price}
        image={item.image}
        quantity={item.quantity}
        total={parseFloat(item.total).toFixed(2)}
        updateCart={(action, product_id) => this.updateCart(action, product_id)}
      />}
  );
  console.log(this.state.item_list.length)
    return (
      <div className="container">
        <div id="cart-card" className="mt-5">
            <div className="row">
                <div className="col-md-8 cart">
                    <div className="title">
                        <div className="row">
                            <div className="col"><h4><b>Shopping Cart</b></h4></div>
                            <div className="col align-self-center text-right text-muted">{this.state.total_items} items</div>
                        </div>
                    </div>
                    {cartProducts} 
      
                    <div className="back-to-shop"><a style={{textDecoration: "none"}} href="/">&#x2190;</a><span className="text-muted">Back to shop</span></div>
                </div>
                <div className="col-md-4 summary">
                    <div><h5><b>Summary</b></h5></div>
                    <hr/>
                    <div className="row">
                        <div className="col" style={{paddingLeft: "0"}}>ITEMS {this.state.total_items}</div>
                        <div className="col text-right">$ {this.state.total_cost}</div>
                    </div>
                    <form>
                        <p>SHIPPING</p>
                        <select><option className="text-muted">Standard-Delivery- &euro;5.00</option></select>
                        <p>GIVE CODE</p>
                        <input id="code" placeholder="Enter your code"/>
                    </form>
                    <div className="row" style={{borderTop: "1px solid rgba(0,0,0,.1)", padding: "2vh 0"}}>
                        <div className="col">TOTAL PRICE</div>
                        <div className="col text-right">$ {this.state.total_cost}</div>
                    </div>
                    <button className="btn btn-color" onClick={this.checkoutRedirect}>CHECKOUT</button>
                </div>
            </div>
            
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, null)(CartPage);
