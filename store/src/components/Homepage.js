import React, { Component } from "react";
import CartPage from "./CartPage";
import ProductPage from "./ProductPage";
import CheckoutPage from "./CheckoutPage";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import Activate from "./Activate";
import ResetPassword from "./ResetPassword";
import ResetPasswordConfirm from "./ResetPasswordConfirm";
import Google from "./Google";
import { getCookie } from "../util";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Product from "./Product";
import Layout from "../hocs/Layout";
import SearchComponent from "./SearchComponent";
import FilterComponent from "./Filter";
import heroImg from "../../static/images/pexels-albin-biju-6717680.jpg";
import { connect } from "react-redux";
import Footer from "./Footer";
import Facebook from "./Facebook";
import Hero from "./Hero";
import AboutPage from "./AboutPage";
class Homepage extends Component {
  constructor(props) {
    super(props);
    this.productsSection = React.createRef();
    this.renderHomePage = this.renderHomePage.bind(this);
    this.state = {
      products: [],
      query: null,
      cartUpdated: this.props.cartUpdated,
      searchClicked: false,
    };
    this.fetchData = this.fetchData.bind(this);
    this.productToggler = this.productToggler.bind(this);
    this.scrollToProducts = this.scrollToProducts.bind(this);
    this.searchClickedToggler = this.searchClickedToggler.bind(this)
  }

  productToggler(data, query) {
    console.log(`home:product ${data}`);
    console.log(`home:query ${query}`);
    console.log(`home:query type ${typeof query}`);
    this.setState((prevstate) => {
      return { ...prevstate, products: data, query: query };
    });
  }
  searchClickedToggler() {
    this.setState((prevState) => {
      return { searchClicked: !prevState.searchClicked  }
    });
  }
  async fetchData() {
    await fetch("/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
    })
      .then((response) => response.json())
      .then((data) => this.setState({ products: data }));
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.cartUpdated !== this.props.cartUpdated) {
      this.setState({ cartUpdated: this.props.cartUpdated });
    }
  }

  scrollToProducts = () => {
    this.productsSection.current.scrollIntoView({ behavior: "smooth" });
  };

  renderHomePage() {
    console.log(this.state.products);
    console.log(heroImg);
    console.log(this.state.query);
    return (
      <div>
        <Hero scrollToProducts={this.scrollToProducts} />
        <div className="container mt-5">
          <div className="row">
            <div className="col-lg-4">
              <h2 className="mb-4">Filter</h2>
              <FilterComponent
                products={this.state.products}
                productToggler={(data) => {
                  this.productToggler(data);
                }}
              />
            </div>
            <div className="col-lg-8">
              <SearchComponent
                products={this.state.products}
                query={this.state.query}
                productToggler={(data, query) => {
                  this.productToggler(data, query);
                
                }}
                searchClicked={this.state.searchClicked}
                searchClickedToggler={this.searchClickedToggler}
              />
              {this.state.searchClicked ? (
                this.state.query ? (
                  this.state.products.length > 0 ? (
                    <h6>Results for "{this.state.query}" query:</h6>
                  ) : (
                    <h6>There are no results for "{this.state.query}" query</h6>
                  )
                ) : (
                  <h6>There are no results for "" query</h6>
                )
              ) : null}
              {/* {this.state.data.length > 0 ? <h6>Results for "{this.state.query}" query:</h6> : <h6>There are no results for "{this.state.query}" query</h6>} */}
              <div
                id="products-section"
                ref={this.productsSection}
                className="row justify-content-md-center"
              >
                {this.state.products &&
                  this.state.products.map((product) => (
                    <Product
                      key={product.id}
                      product={product}
                      cart_total_updated={this.props.cart_total_updated}
                      updatedToggler={this.props.updatedToggler}
                    />
                  ))}
                {this.state.products && console.log(this.state.products)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      <BrowserRouter>
        <Layout
          cart_total_updated={this.props.cart_total_updated}
          updatedToggler={this.props.updatedToggler}
          cartUpdated={this.state.cartUpdated}
          cartUpdatedToggler={this.props.cartUpdatedToggler}
        />

        <Switch>
          <Route exact path="/">
            {this.renderHomePage()}
          </Route>
          <Route
            path="/cart"
            render={(props) => (
              <CartPage
                {...props}
                cartUpdated={this.state.cartUpdated}
                updatedToggler={this.props.updatedToggler}
                cartUpdatedToggler={() => {
                  this.props.cartUpdatedToggler();
                }}
              />
            )}
          />
          <Route
            path="/product/:id"
            render={(props) => {
              return (
                <ProductPage
                  {...props}
                  cartUpdated={this.state.cartUpdated}
                  updatedToggler={this.props.updatedToggler}
                  cartUpdatedToggler={this.props.cartUpdatedToggler}
                />
              );
            }}
          />
          <Route
            path="/checkout"
            render={(props) => <CheckoutPage {...props} />}
          />
          <Route path="/register" component={RegisterPage} />
          <Route path="/about" component={AboutPage} />
          <Route
            path="/login"
            render={(props) => {
              if (this.props.isAuthenticated) {
                // If user is already logged in, redirect to the homepage
                return <Redirect to="/" />;
              } else {
                // Render the login page
                return <LoginPage {...props} />;
              }
            }}
          />

          <Route
            path="/activate/:uid/:token"
            render={(props) => {
              return <Activate {...props} />;
            }}
          />
          <Route exact path="/reset-password" component={ResetPassword} />
          <Route
            path="/password/reset/confirm/:uid/:token"
            render={(props) => {
              return <ResetPasswordConfirm {...props} />;
            }}
          />
          <Route exact path="/google" component={Google} />
          <Route path="/facebook" component={Facebook} />
        </Switch>
        <Footer />
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  formErrors: state.auth.formErrors,
});

export default connect(mapStateToProps, null)(Homepage);
