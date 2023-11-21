import React, { Component } from "react";
import arrowUp from "../../static/images/arrow-up.png";
import arrowDown from "../../static/images/arrow-down.png";
import placeHolderImage from "../../static/images/placeholder.png";
export default class CartProduct extends Component {
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
          <p>${this.props.price}</p>
        </div>
        <div style={{ flex: "1" }}>
          <p className="quantity">{this.props.quantity}</p>
          <div className="quantity">
            <img className="chg-quantity" src={arrowUp} onClick={() => {this.props.addOrRemoveItemHandler('add', this.props.name)}}/>
            <img className="chg-quantity" src={arrowDown} onClick={() => {this.props.addOrRemoveItemHandler('remove', this.props.name)}}/>
          </div>
        </div>
        <div style={{ flex: "1" }}>
          <p>${this.props.total}</p>
        </div>
      </div>
    );
  }
}
