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
// import NavBar from "./Navbar";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Product from "./Product";
import Layout from "../hocs/Layout";
import SearchComponent from "./SearchComponent";
import FilterComponent from "./Filter";
import heroImg from "../../static/images/pexels-albin-biju-6717680.jpg";
import { connect } from "react-redux";
import Footer from "./Footer";
import Facebook from "./Facebook";
class Homepage extends Component {
  constructor(props) {
    super(props);
    this.renderHomePage = this.renderHomePage.bind(this);
    this.state = {
      products: [],
      cartUpdated: this.props.cartUpdated
    };
    this.fetchData = this.fetchData.bind(this);
    this.productToggler = this.productToggler.bind(this);
  }

  productToggler(data) {
    console.log(`home:product ${data}`);
    this.setState((prevstate) => {
      return { ...prevstate, products: data };
    });
  }

  fetchData() {
    fetch("/api/products", {
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
    // if (prevState.products !== this.state.products) {
    //   this.fetchData()
    // }
  }
  renderHomePage() {
    console.log(this.state.products);
    console.log(heroImg);
    return (
      <div>
        <div
          className="hero-section mb-5"
          style={{
            backgroundImage: `url(${heroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 style={{ color: "#92ecf6" }}>Welcome to Our Store</h1>
          <p>Explore our collection of amazing products.</p>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <p className="navbar-brand mb-4">Filter</p>
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
                productToggler={(data) => {
                  this.productToggler(data);
                }}
              />
              <div className="row">
                {this.state.products.map((product) => (
                  <Product
                    key={product.id}
                    product={product}
                    cart_total_updated={this.props.cart_total_updated}
                    updatedToggler={this.props.updatedToggler}
                  />
                ))}
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
            render={(props) => (
              <CheckoutPage {...props} />
            )}
          />
          <Route path="/register" component={RegisterPage} />
          <Route
            path="/login"
            render={(props) => {
              if (this.props.isAuthenticated) {
                // If user is already logged in, redirect to the homepage
                return <Redirect to="/" />;
              } else {
                // Render the login page
                return (
                  <LoginPage {...props}/>
                );
              }
            }}
          />
          {/* <Route exact path="/activate/:uid/:token" component={Activate} /> */}
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
          <Route exact path="/google" component={Google}/>
          <Route path="/facebook" component={Facebook}/>
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