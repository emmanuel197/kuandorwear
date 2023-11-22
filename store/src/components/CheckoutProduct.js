import React, { Component } from "react";
import arrowUp from "../../static/images/arrow-up.png";
import arrowDown from "../../static/images/arrow-down.png";
import placeHolderImage from "../../static/images/placeholder.png";
export default class CheckoutProduct extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
        <div className="cart-row">
            <div style={{ flex: "2" }}>
            <img className="row-image" src={this.props.image} />
            </div>
            <div style={{ flex: "2" }}>
            <p>{this.props.name}</p>
            </div>
            <div style={{ flex: "1" }}>
            <p>${this.props.total}</p>
            </div>
            <div style={{ flex: "1" }}>
            <p>x{this.props.quantity}</p>
            </div>
        </div>
        );
  }
}
