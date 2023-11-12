import React, { Component } from "react";
import placeHolderImage from "../../static/images/placeholder.png"
import { Link } from "react-router-dom";
export default class Product extends Component {
  constructor(props) {
    super(props);
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

            <button  className="btn btn-outline-secondary add-btn">Add to Cart</button>
            <Link className="btn btn-outline-success ml-2" to={`/product/${this.props.product.id}`}>View</Link>
            <h4 style={styles}><strong>${this.props.product.price}</strong></h4>
        </div>
      </div>
    );
  }
}
