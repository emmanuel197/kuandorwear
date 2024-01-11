import React, { Component } from "react";
import placeHolderImage from "../../static/images/placeholder.png"
import { Link } from "react-router-dom";
import { getCookie } from "../util";
import {connect} from 'react-redux'
import { addCookieItem, handleOrderedItem } from "../cart";
class Product extends Component {
  constructor(props) {
    super(props);
    this.addToCart = this.addToCart.bind(this)
  }

  addToCart(action, product_id) {
    console.log(this.props.isAuthenticated)
    if (this.props.isAuthenticated) {
      handleOrderedItem.call(this, product_id)
    } else{
      addCookieItem(action, product_id)
    }
  }
  
  
  
  render() {
    console.log(this.props.product.image)
    const styles = {
      display: 'inline-block',
      float: 'right'
    }
    return (
      <div className="col-lg-4">
        <img className="thumbnail" src={this.props.product.image} />
        <div className="box-element product">
            <h6><strong>{this.props.product.name}</strong></h6>
            <hr/>

            <button  className="btn btn-outline-secondary add-btn" 
            onClick={() => {
              this.addToCart('add', this.props.product.id)}}>Add to Cart</button>
            <Link className="btn btn-outline-success ml-2" to={`/product/${this.props.product.id}`}>View</Link>
            <h4 style={styles}><strong>${this.props.product.price}</strong></h4>
        </div>
      </div>
    );
  }
}

const mapStatetoProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStatetoProps, null)(Product)