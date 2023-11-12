import React, { Component } from "react";
import Product from "./Product";
import placeHolderImage from "../../static/images/placeholder.png";

export default class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {},
      error: ""
    };
    this.productDetailData = this.productDetailData.bind(this)
    this.renderProductDetail = this.renderProductDetail.bind(this)
    this.renderProductError = this.renderProductError.bind(this)
    this.productDetailData()
    
  }

productDetailData() {
  console.log("run")
  const id = this.props.match.params.id;
  console.log(id)
  fetch(`/api/product/${id}`)
    .then(response => {
      console.log(response)
      if(response.ok) {
        return response.json()
      } else {
        this.setState({error: 'Product not found'})
      }
    })
    .then(data => {
      this.setState({ product: data })
    })
    .catch(error => console.log(error));
}

renderProductDetail() {
  return (
    <div id="product-detail-wrapper">
        <div className="row">
        <div className="col-md-6">
          <img id="product-detail-img" src={this.state.product.image} alt="Perfume bottle"/>
        </div>
        <div className="col-md-6">
          <div className="box-element" id="product-detail-content">
            <h1 id="product-detail-header">{this.state.product.name}</h1>
            <p id="product-detail-text">{this.state.product.description}</p>
            <p id="price">${this.state.product.price} <del>$199.99</del></p>
            <a id="product-detail-button" href="/">Add to Cart</a>
          </div>
        </div>
      </div> 
    </div>
  )
}

renderProductError() {
  return (
    
  <div class="modal-dialog modal-confirm">
		<div class="modal-content">
			<div class="modal-header">
				<div class="icon-box">
					<i class="material-icons">&#xE86B;</i>
					<i class="material-icons">&#xE86B;</i>
					<i class="material-icons">&#xE645;</i>
				</div>
			</div>
			<div class="modal-body text-center">
				<h4>Something went wrong</h4>	
				<p>{this.state.error}</p>
				{/* <button class="btn btn-primary"  href="{% url 'homepage' %}">Go Back</button> */}
        <a id="product-detail-button" href="/">Go Back</a>
			</div>
		</div>
	</div> 
    
  );
}


  render() {
      if (this.state.error == "" ) {
        return  this.renderProductDetail()
      } else {
        return this.renderProductError();
      }
      
  }
      
    ;
  }



