import React, { Component } from 'react';
import { connect } from 'react-redux';
import { checkAuthenticated, load_user } from '../actions/auth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

class Layout extends Component {
    componentDidMount() {
    //     // Call action creators directly without destructure
        this.props.checkAuthenticated();
        this.props.load_user();
    }

    render() {
        const { children } = this.props;

        return (
            <div>
                <Navbar 
                logged_in={this.props.logged_in}
                cart_total_updated={this.props.cart_total_updated}
                updatedToggler={this.props.updatedToggler}
                cartUpdated={this.props.cartUpdated}
                cartUpdatedToggler={this.props.cartUpdatedToggler}/>
                {children}
            </div>
        );
    }
}

export default connect(null, { checkAuthenticated, load_user })(Layout);