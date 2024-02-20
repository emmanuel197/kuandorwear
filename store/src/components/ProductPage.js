import React, { Component } from "react";
// import Product from "./Product";
// import placeHolderImage from "../../static/images/placeholder.png";
import { getCookie } from "../util";
import {
  addCookieItem,
  handleOrderedItem,
  cookieCart,
  addOrRemoveItemHandler,
} from "../cart";
import { connect } from "react-redux";
class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: [],
      product_images: [],
      selectedColor: null,
      selectedImage: null,
      product_sizes: [],
      item_list: [],
      quantity: 0,
      error: "",
      // imageClassName: "rounded-4 fit",
    };
    this.productDetailData = this.productDetailData.bind(this);
    this.renderProductDetail = this.renderProductDetail.bind(this);
    this.renderProductError = this.renderProductError.bind(this);
    this.productDetailData();
  }

 

  async fetchData() {
    const itemIdToFind = this.props.match.params.id;
    if (this.props.isAuthenticated) {
      const jwtToken = localStorage.getItem("access");

      fetch("/api/cart-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
          Authorization: `JWT ${jwtToken}`,
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
          console.log(`data: ${data.items}`);
          const item = data.items.find((item) => item["id"] == itemIdToFind);
          console.log(`item: ${item}`)
          this.setState({
            quantity: item.quantity ? item.quantity : 0,
          });
        })
      .catch((errorData) => {
        console.log(errorData)
        this.setState({
        quantity: 0
      })});
    } else {
      const { items } = await cookieCart.call(this);
      console.log(items)
      console.log(`length: ${items.length}`)
      const item = items.find((item) => item["id"] == itemIdToFind);
      this.setState({
        quantity: item ? item.quantity : 0,
      });
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.cartUpdated !== this.props.cartUpdated) {
      this.fetchData();
    }
    if (prevProps.isAuthenticated !== this.props.isAuthenticated) {
      this.fetchData();
    }

    if (prevState.quantity !== this.state.quantity) {
      if (this.state.quantity === 0) {
        this.fetchData();
      }
    }

    if (prevState.product.image !== this.state.product.image) {
      if (this.state.product_images.length != 0) {
        const selectedVariant = this.state.product_images.find(
          (image) => image.image === this.state.product.image
        );
        const defaultImage = this.state.product_images.find(
          (image) => image.default
        );
        this.setState({
          selectedColor: selectedVariant?.color || defaultImage.color,
        });
      }
    }
  }

  addToCart(action, product_id) {
    if (this.props.isAuthenticated) {
      handleOrderedItem.call(this, product_id);
    } else {
      addCookieItem.call(this, action, product_id);
    }
  }

  updateCart(action, product_id) {
    if (this.props.isAuthenticated) {
      addOrRemoveItemHandler.call(this, action, product_id);
    } else {
      addCookieItem.call(this, action, product_id);
    }
  }

  async productDetailData() {
    const id = this.props.match.params.id;
    await fetch(`/api/product/${id}`)
      .then(async (response) => {
        if (response.ok) {
          return await response.json();
        } else {
          this.setState({ error: "Product not found" });
        }
      })
      .then((data) => {
        if (data.images.length != 0) {
          const defaultImage = data.images.find((image) => image.default);
          console.log(defaultImage);
          console.log(defaultImage.color);
          this.setState({
            product: data,
            product_images: data.images,
            product_sizes: data.sizes,
            selectedColor: defaultImage.color,
          });
        } else {
          this.setState({ product: data, product_sizes: data.sizes });
        }
      });
  }

  renderProductDetail() {
    const product_image_variants = this.state.product_images.map(
      (image_object) => (
        <a
          data-fslightbox="mygalley"
          className="border mx-1 rounded-2 item-thumb"
          target="_blank"
          data-type="image"
        >
          <img
            key={image_object.id}
            width="60"
            height="60"
            className="rounded-2"
            src={image_object.image}
            style={{ cursor: "pointer"}}
            onClick={() =>
              this.setState({
                product: {
                  ...this.state.product,
                  image: image_object.image,
                  selectedVariant: image_object.image,
                  selectedColor: image_object.color,
                }
              })
            }
          />
        </a>
      )
    );
    
    

    const product_sizes = this.state.product_sizes.map((sizeObj, index) => (
      <option key={index}>{sizeObj.size.name}</option>
    ));
    console.log(product_sizes);

    return (
      
      <div>
        <section className="py-5">
          <div className="container">
            <div className="row gx-5">
              <aside className="col-lg-6">
                <div className="border rounded-4 mb-3 d-flex justify-content-center">
                  <a
                    data-fslightbox="mygalley"
                    className="rounded-4"
                    target="_blank"
                    data-type="image"
                    href="#"
                  >
                    <img
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100vh",
                        margin: "auto",
                      }}
                      className="rounded-4 fit"
                      src={this.state.product.image}
                    />
                  </a>
                </div>
                <div className="d-flex justify-content-center mb-3">
                  {product_image_variants}
                </div>
              </aside>
              <main className="col-lg-6">
                <div className="ps-lg-3">
                  <h4 className="title text-dark">{this.state.product.name}</h4>
                  <div className="d-flex flex-row my-3">
                    <div className="text-warning mb-1 me-2">
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fas fa-star-half-alt"></i>
                      <span className="ms-1">4.5</span>
                    </div>
                    <span className="text-muted">
                      <i className="fas fa-shopping-basket fa-sm mx-1"></i>{this.state.product.total_completed_orders}
                      {this.state.totalCompletedOrders !== 0 && console.log(`totalCompletedOrders: ${this.state.totalCompletedOrders}`)}
                       {this.state.totalCompletedOrders === 1? " order": " orders"}
                    </span>
                    <span className="text-success ms-2">In stock</span>
                  </div>

                  <div className="mb-3">
                    <span className="h5">
                      ${this.state.product.discount_price}{" "}
                    </span>
                    <span className="text-muted">
                      <del>${this.state.product.price}</del>
                    </span>
                  </div>

                  <p>{this.state.product.description}</p>

                  <div className="row gap">
                    <dt className="col-3">Type</dt>
                    <dd className="col-9">Regular</dd>

                    {this.state.selectedColor && <dt className="col-3">Color</dt>}
                    {this.state.selectedColor && <dd className="col-9">
                      <dd className="col-9">{this.state.selectedColor}</dd>
                    </dd>}
                    {this.state.product.brand && (
                      <dt className="col-3">Brand</dt>
                    )}
                    {this.state.product.brand && (
                      <dd className="col-9">{this.state.product.brand}</dd>
                    )}
                  </div>

                  <hr />

                  <div className="row mb-4">
                    {this.state.product_sizes.length != 0 && (
                      <div className="col-md-4 col-lg-6 col-sm-3 ">
                        <label className="mb-2">Size</label>
                        <select
                          className="form-select border border-secondary"
                          style={{ height: "35px", width: '100%'}}
                        >
                          {product_sizes}
                        </select>
                      </div>
                    )}
                    <div className="col-md-4 col-lg-6 mb-3">
                      <label className="mb-2 d-block">Quantity</label>
                      <div
                        className="input-group mb-3"
                        style={{ width: '100%' }}
                      >
                        <button
                          className="btn border border-secondary px-3"
                          type="button"
                          id="button-addon1"
                          data-mdb-ripple-color="dark"
                          onClick={() => {
                            this.updateCart(
                              "remove",
                              this.props.match.params.id
                            );
                          }}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <input
                          type="text"
                          className="form-control text-center border border-secondary"
                          name="quantity"
                          value={this.state.quantity ? this.state.quantity : 0}
                          aria-label="Example text with button addon"
                          aria-describedby="button-addon1"
                        />
                        <button
                          className="btn btn-white border border-secondary px-3"
                          type="button"
                          id="button-addon2"
                          data-mdb-ripple-color="dark"
                          onClick={() => {
                            this.updateCart("add", this.props.match.params.id);
                          }}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="row gap-1" style={{paddingLeft: "12px", paddingRight: "12px"}}>
                    <a id="buy-now" href="#" className="btn shadow-0 col-lg-4">
                      {" "}
                      Buy now{" "}
                    </a>
                    <a
                      onClick={() => {
                        this.addToCart("add", this.props.match.params.id);
                      }}
                      className="btn shadow-0 col-lg-4"
                      id="add-to-cart"
                    >
                      {" "}
                      <i className="me-1 fa fa-shopping-basket"></i> Add to cart{" "}
                    </a>
                    <a
                      href="#"
                      className="btn btn-light border border-secondary py-2 icon-hover px-3 col-lg-4"
                    >
                      {" "}
                      <i className="me-1 fa fa-heart fa-lg"></i> Save{" "}
                    </a>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </section>
      </div>
    );
  }

  renderProductError() {
    return (
      <div className="modal-dialog modal-confirm mt-5">
        <div className="modal-content">
          <div className="modal-header">
            <div className="icon-box">
              <i className="material-icons">&#xE86B;</i>
              <i className="material-icons">&#xE86B;</i>
              <i className="material-icons">&#xE645;</i>
            </div>
          </div>
          <div className="modal-body text-center">
            <h4>Something went wrong</h4>
            <p>{this.state.error}</p>
            <a id="product-detail-button" href="/">
              Go Back
            </a>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.error == "") {
      return this.renderProductDetail();
    } else {
      return this.renderProductError();
    }
  }
}

const mapStatetoProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStatetoProps, null)(ProductPage);
