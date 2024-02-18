import React, { Component } from "react";
import placeHolderImage from "../../static/images/placeholder.png";
import { Link } from "react-router-dom";
import { getCookie } from "../util";
import { connect } from "react-redux";
import { addCookieItem, handleOrderedItem } from "../cart";
class Product extends Component {
  constructor(props) {
    super(props);
    this.addToCart = this.addToCart.bind(this);
  }

  addToCart(action, product_id) {
    console.log(this.props.isAuthenticated);
    if (this.props.isAuthenticated) {
      handleOrderedItem.call(this, product_id);
    } else {
      addCookieItem.call(this, action, product_id);
    }
  }

  render() {
    console.log(this.props.product.image);
    const styles = {
      display: "inline-block",
      float: "right",
    };

    const { product } = this.props;
    return (
      <div className="col-lg-4 col-md-5 product-col">
        <div id="product-wrapper" className="rounded-3">
        <div className="position-relative">
          <div className="image-container">
            <img className="thumbnail" src={product.image} />
          </div>
          <span
            id="product-badge"
            className="badge  position-absolute"
            style={{ top: "10px", right: "10px" }}
          >
            ${product.discount_price}
          </span>
        </div>
        <div className="box-element product">
          <h6>
            <strong>{product.name}</strong>
          </h6>
          <hr />
          <div className="row px-2">
            <button
              id="product-add-to-cart"
              className="col-7 btn btn-outline-secondary add-btn me-auto"
              onClick={() => {
                this.addToCart("add", product.id);
              }}
            >
              Add to Cart
            </button>

            <Link
              id="product-view-btn"
              className="col-4 btn"
              to={`/product/${product.id}`}
            >
              View
            </Link>
          </div>
        </div>
        </div>
        
      </div>
    );
  }
}

const mapStatetoProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStatetoProps, null)(Product);
