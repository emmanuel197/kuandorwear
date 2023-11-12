import React, { Component } from "react";
import placeHolderImage from "../../static/images/placeholder.png";
import arrowUp from "../../static/images/arrow-up.png";
import arrowDown from "../../static/images/arrow-down.png";
export default class CartPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const styles = {
      float: "right",
      margin: "5px",
    };
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
                  Items: <strong>3</strong>
                </h5>
              </th>
              <th>
                <h5>
                  Total:<strong> $42</strong>
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
          <div className="cart-row">
            <div style={{ flex: "2" }}>
              <img className="row-image" src={placeHolderImage} />
            </div>
            <div style={{ flex: "2" }}>
              <p>Product 1</p>
            </div>
            <div style={{ flex: "1" }}>
              <p>$20</p>
            </div>
            <div style={{ flex: "1" }}>
              <p className="quantity">2</p>
              <div className="quantity">
                <img className="chg-quantity" src={arrowUp} />
                <img className="chg-quantity" src={arrowDown} />
              </div>
            </div>
            <div style={{ flex: "1" }}>
              <p>$32</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
