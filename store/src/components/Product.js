import React, { Component } from "react";
import placeHolderImage from "../../static/images/placeholder.png"
import { Link } from "react-router-dom";
export default class Product extends Component {
  constructor(props) {
    super(props);
    this.handleOrderedItem = this.handleOrderedItem.bind(this)
  }

  
  handleOrderedItem(product_id) {
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"product_id": product_id})
    }
    fetch('/api/create-order/', requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error(`Fetch Error =\n`, error));
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
              this.handleOrderedItem(this.props.product.id)}}>Add to Cart</button>
            <Link className="btn btn-outline-success ml-2" to={`/product/${this.props.product.id}`}>View</Link>
            <h4 style={styles}><strong>${this.props.product.price}</strong></h4>
        </div>
      </div>
    );
  }
}
