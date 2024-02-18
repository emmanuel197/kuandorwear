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
      totalCompletedOrders: 0,
      error: "",
      // imageClassName: "rounded-4 fit",
    };
    this.productDetailData = this.productDetailData.bind(this);
    this.renderProductDetail = this.renderProductDetail.bind(this);
    this.renderProductError = this.renderProductError.bind(this);
    // this.imageChange = this.imageChange.bind(this);
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
          // console.log(itemIdToFind)
          const item = data.items.find((item) => item["id"] == itemIdToFind);
          console.log(`item: ${item}`)
          this.setState({
            quantity: item.quantity ? item.quantity : 0,
            totalCompletedOrders: item.total_completed_orders
          });
        })
      .catch((errorData) => {
        console.log(errorData)
        this.setState({
        quantity: 0
      })});
    } else {
      // console.log("cookieCart");
      const { items } = await cookieCart.call(this);
      console.log(items)
      const item = items.find((item) => item["id"] == itemIdToFind);
      console.log(`total_completed_orders: ${item.total_completed_orders}`)
      this.setState({
        quantity: item.quantity ? item.quantity : 0,
        totalCompletedOrders: item.total_completed_orders
      });
      // console.log(items);
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
    // console.log(this.props.isAuthenticated);
    if (this.props.isAuthenticated) {
      handleOrderedItem.call(this, product_id);
    } else {
      addCookieItem.call(this, action, product_id);
    }
  }

  updateCart(action, product_id) {
    // console.log(this.props.isAuthenticated);
    // this.setState((prevState) => return {...prevState, isAuthenticated: this.props.isAuthenticated})
    // console.log(product_id);
    if (this.props.isAuthenticated) {
      addOrRemoveItemHandler.call(this, action, product_id);
    } else {
      addCookieItem.call(this, action, product_id);
    }
  }

  async productDetailData() {
    // console.log("run");
    const id = this.props.match.params.id;
    // console.log(id);
    await fetch(`/api/product/${id}`)
      .then(async (response) => {
        // console.log(response);
        if (response.ok) {
          return await response.json();
        } else {
          this.setState({ error: "Product not found" });
        }
      })
      .then((data) => {
        console.log(data.images);
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

        // console.log(data.sizes)
      });
    // .catch((error) => console.log(error));
  }
  // imageChange() {
  //   console.log("image changed")
  //   this.setState({ imageClassName: "rounded-4 fit selected" });
  // }
  renderProductDetail() {
    // const imageChange = this.imageChange() 
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
    // console.log(this.state.product_sizes)
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
                      // onChange={imageChange}
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
                      <i className="fas fa-shopping-basket fa-sm mx-1"></i>{this.state.totalCompletedOrders}
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

                    {/* <dt className="col-3">Material</dt>
                    <dd className="col-9">Cotton, Jeans</dd> */}

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
                    {/* <div className="col-md-4 col-6">
                      <label className="mb-2">Size</label>
                      <select
                        className="form-select border border-secondary"
                        style={{height: "35px"}}
                      >
                        {product_sizes}
                      </select>
                    </div> */}
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
                          value={this.state.quantity}
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

        {/* <section className="bg-light border-top py-4">
          <div className="container">
            <div className="row gx-4">
              <div className="col-lg-8 mb-4">
                <div className="border rounded-2 px-3 py-2 bg-white">
                  <ul
                    className="nav nav-pills nav-justified mb-3"
                    id="ex1"
                    role="tablist"
                  >
                    <li className="nav-item d-flex" role="presentation">
                      <a
                        className="nav-link d-flex align-items-center justify-content-center w-100 active"
                        id="ex1-tab-1"
                        data-mdb-toggle="pill"
                        href="#ex1-pills-1"
                        role="tab"
                        aria-controls="ex1-pills-1"
                        aria-selected="true"
                      >
                        Specification
                      </a>
                    </li>
                    <li className="nav-item d-flex" role="presentation">
                      <a
                        className="nav-link d-flex align-items-center justify-content-center w-100"
                        id="ex1-tab-2"
                        data-mdb-toggle="pill"
                        href="#ex1-pills-2"
                        role="tab"
                        aria-controls="ex1-pills-2"
                        aria-selected="false"
                      >
                        Warranty info
                      </a>
                    </li>
                    <li className="nav-item d-flex" role="presentation">
                      <a
                        className="nav-link d-flex align-items-center justify-content-center w-100"
                        id="ex1-tab-3"
                        data-mdb-toggle="pill"
                        href="#ex1-pills-3"
                        role="tab"
                        aria-controls="ex1-pills-3"
                        aria-selected="false"
                      >
                        Shipping info
                      </a>
                    </li>
                    <li className="nav-item d-flex" role="presentation">
                      <a
                        className="nav-link d-flex align-items-center justify-content-center w-100"
                        id="ex1-tab-4"
                        data-mdb-toggle="pill"
                        href="#ex1-pills-4"
                        role="tab"
                        aria-controls="ex1-pills-4"
                        aria-selected="false"
                      >
                        Seller profile
                      </a>
                    </li>
                  </ul>

                  <div className="tab-content" id="ex1-content">
                    <div
                      className="tab-pane fade show active"
                      id="ex1-pills-1"
                      role="tabpanel"
                      aria-labelledby="ex1-tab-1"
                    >
                      <p>
                        With supporting text below as a natural lead-in to
                        additional content. Lorem ipsum dolor sit amet,
                        consectetur adipisicing elit, sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam, quis nostrud exercitation ullamco laboris
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure
                        dolor in reprehenderit in voluptate velit esse cillum
                        dolore eu fugiat nulla pariatur.
                      </p>
                      <div className="row mb-2">
                        <div className="col-12 col-md-6">
                          <ul className="list-unstyled mb-0">
                            <li>
                              <i className="fas fa-check text-success me-2"></i>
                              Some great feature name here
                            </li>
                            <li>
                              <i className="fas fa-check text-success me-2"></i>
                              Lorem ipsum dolor sit amet, consectetur
                            </li>
                            <li>
                              <i className="fas fa-check text-success me-2"></i>
                              Duis aute irure dolor in reprehenderit
                            </li>
                            <li>
                              <i className="fas fa-check text-success me-2"></i>
                              Optical heart sensor
                            </li>
                          </ul>
                        </div>
                        <div className="col-12 col-md-6 mb-0">
                          <ul className="list-unstyled">
                            <li>
                              <i className="fas fa-check text-success me-2"></i>
                              Easy fast and ver good
                            </li>
                            <li>
                              <i className="fas fa-check text-success me-2"></i>
                              Some great feature name here
                            </li>
                            <li>
                              <i className="fas fa-check text-success me-2"></i>
                              Modern style and design
                            </li>
                          </ul>
                        </div>
                      </div>
                      <table className="table border mt-3 mb-2">
                        <tr>
                          <th className="py-2">Display:</th>
                          <td className="py-2">
                            13.3-inch LED-backlit display with IPS
                          </td>
                        </tr>
                        <tr>
                          <th className="py-2">Processor capacity:</th>
                          <td className="py-2">
                            2.3GHz dual-core Intel Core i5
                          </td>
                        </tr>
                        <tr>
                          <th className="py-2">Camera quality:</th>
                          <td className="py-2">720p FaceTime HD camera</td>
                        </tr>
                        <tr>
                          <th className="py-2">Memory</th>
                          <td className="py-2">8 GB RAM or 16 GB RAM</td>
                        </tr>
                        <tr>
                          <th className="py-2">Graphics</th>
                          <td className="py-2">Intel Iris Plus Graphics 640</td>
                        </tr>
                      </table>
                    </div>
                    <div
                      className="tab-pane fade mb-2"
                      id="ex1-pills-2"
                      role="tabpanel"
                      aria-labelledby="ex1-tab-2"
                    >
                      Tab content or sample information now <br />
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum. Lorem ipsum
                      dolor sit amet, consectetur adipisicing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo
                    </div>
                    <div
                      className="tab-pane fade mb-2"
                      id="ex1-pills-3"
                      role="tabpanel"
                      aria-labelledby="ex1-tab-3"
                    >
                      Another tab content or sample information now <br />
                      Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum.
                    </div>
                    <div
                      className="tab-pane fade mb-2"
                      id="ex1-pills-4"
                      role="tabpanel"
                      aria-labelledby="ex1-tab-4"
                    >
                      Some other tab content or sample information now <br />
                      Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum.
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="px-0 border rounded-2 shadow-0">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Similar items</h5>
                      <div className="d-flex mb-3">
                        <a href="#" className="me-3">
                          <img
                            src="https://bootstrap-ecommerce.com/bootstrap5-ecommerce/images/items/8.webp"
                            style={{ minWidth: "96px", height: "96px" }}
                            className="img-md img-thumbnail"
                          />
                        </a>
                        <div className="info">
                          <a href="#" className="nav-link mb-1">
                            Rucksack Backpack Large <br />
                            Line Mounts
                          </a>
                          <strong className="text-dark"> $38.90</strong>
                        </div>
                      </div>

                      <div className="d-flex mb-3">
                        <a href="#" className="me-3">
                          <img
                            src="https://bootstrap-ecommerce.com/bootstrap5-ecommerce/images/items/9.webp"
                            style={{ minWidth: "96px", height: "96px" }}
                            className="img-md img-thumbnail"
                          />
                        </a>
                        <div className="info">
                          <a href="#" className="nav-link mb-1">
                            Summer New Men's Denim <br />
                            Jeans Shorts
                          </a>
                          <strong className="text-dark"> $29.50</strong>
                        </div>
                      </div>

                      <div className="d-flex mb-3">
                        <a href="#" className="me-3">
                          <img
                            src="https://bootstrap-ecommerce.com/bootstrap5-ecommerce/images/items/10.webp"
                            style={{ minWidth: "96px", height: "96px" }}
                            className="img-md img-thumbnail"
                          />
                        </a>
                        <div className="info">
                          <a href="#" className="nav-link mb-1">
                            {" "}
                            T-shirts with multiple colors, for men and lady{" "}
                          </a>
                          <strong className="text-dark"> $120.00</strong>
                        </div>
                      </div>

                      <div className="d-flex">
                        <a href="#" className="me-3">
                          <img
                            src="https://bootstrap-ecommerce.com/bootstrap5-ecommerce/images/items/11.webp"
                            style={{ minWidth: "96px", height: "96px" }}
                            className="img-md img-thumbnail"
                          />
                        </a>
                        <div className="info">
                          <a href="#" className="nav-link mb-1">
                            {" "}
                            Blazer Suit Dress Jacket for Men, Blue color{" "}
                          </a>
                          <strong className="text-dark"> $339.90</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
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
            {/* <button className="btn btn-primary"  href="{% url 'homepage' %}">Go Back</button> */}
            <a id="product-detail-button" href="/">
              Go Back
            </a>
          </div>
        </div>
      </div>
    );
  }

  render() {
    // const images = this.state.product.images;
    // console.log(images)
    
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
