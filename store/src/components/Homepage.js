    import React, { Component } from "react";
    import CartPage from "./CartPage";
    import ProductPage from "./ProductPage";
    import CheckoutPage from "./CheckoutPage";
    import RegisterPage from "./RegisterPage"
    import LoginPage from "./LoginPage"
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
        fetch("/api/products")
        .then((response) => response.json())
        .then((data) => this.setState({ products: data }));
    }

    renderHomePage() {
        return (
        <div className="row">
            {this.state.products.map((product) => (
            <Product key={product.id} product={product} />
            ))}
        </div>
        );
    }
    render() {
        return (
        <BrowserRouter>
            <Switch>
            <Route exact path="/">
                {this.renderHomePage()}
            </Route>
            <Route path="/cart" component={CartPage} />
            <Route path="/product/:id" render={(props) => {
                            return <ProductPage {...props} />}} />
            <Route path="/checkout" component={CheckoutPage} />
            <Route path="/register" component={RegisterPage}/>
            <Route path="/login" render={(props) => {
                return <LoginPage {...props} logged_in={this.props.logged_in} logToggler={this.props.logToggler}/>}} />
            </Switch>
        </BrowserRouter>
        );
    }
    }
