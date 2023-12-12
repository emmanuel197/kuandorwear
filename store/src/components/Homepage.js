import React, { Component } from "react";
import CartPage from "./CartPage";
import ProductPage from "./ProductPage";
import CheckoutPage from "./CheckoutPage";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import NavBar from "./Navbar";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Product from "./Product";
export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.renderHomePage = this.renderHomePage.bind(this);
    this.state = {
      products: [],
    };
  }

  componentDidMount() {
    const headers = {
      "Content-Type": "application/json",
    };
    if (this.props.logged_in) {
      const csrftoken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken"))
        .split("=")[1];
      headers["X-CSRFToken"] = csrftoken;
    }
    fetch("/api/products", {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => this.setState({ products: data }));
  }

  renderHomePage() {
    return (
      <div>
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
    );
  }
  render() {
    return (
      <BrowserRouter>
        <NavBar
          logged_in={this.props.logged_in}
          cart_total_updated={this.props.cart_total_updated}
          updatedToggler={this.props.updatedToggler}
        />
        <br></br>
        <div className="container">
          <Switch>
            <Route exact path="/">
              {this.renderHomePage()}
            </Route>
            <Route
              path="/cart"
              render={(props) => (
                <CartPage {...props} logged_in={this.props.logged_in} />
              )}
            />
            <Route
              path="/product/:id"
              render={(props) => {
                return (
                  <ProductPage
                    {...props}
                    logged_in={this.props.logged_in}
                    updatedToggler={this.props.updatedToggler}
                  />
                );
              }}
            />
            <Route
              path="/checkout"
              render={(props) => (
                <CheckoutPage {...props} logged_in={this.props.logged_in} />
              )}
            />
            <Route path="/register" component={RegisterPage} />
            <Route
              path="/login"
              render={(props) => {
                if (this.props.logged_in) {
                  // If user is already logged in, redirect to the homepage
                  return <Redirect to="/" />;
                } else {
                  // Render the login page
                  return (
                    <LoginPage
                      {...props}
                      logged_in={this.props.logged_in}
                      logToggler={this.props.logToggler}
                    />
                  );
                }
              }}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
