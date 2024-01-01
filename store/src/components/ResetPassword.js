import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { reset_password } from '../actions/auth';

class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestSent: false,
            formData: {
                email: ''
            }
        };
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e) {
        const { name, value } = e.target;
        this.setState({
            formData: {
                ...this.state.formData,
                [name]: value
            }
        });
    };

    onSubmit(e) {
        e.preventDefault();

        const { email } = this.state.formData;
        this.props.reset_password(email);
        this.setState({ requestSent: true });
    };

    render() {
        const { requestSent, formData } = this.state;
        const { email } = formData;

        if (requestSent) {
            return <Redirect to='/' />;
        }

        return (
            <div className='container mt-5'>
                <h1>Request Password Reset:</h1>
                <form onSubmit={this.onSubmit}>
                    <div className='form-group'>
                        <input
                            className='form-control'
                            type='email'
                            placeholder='Email'
                            name='email'
                            value={email}
                            onChange={this.onChange}
                            required
                        />
                    </div>
                    <button className='btn btn-primary' type='submit'>
                        Reset Password
                    </button>
                </form>
            </div>
        );
    }
}

export default connect(null, { reset_password })(ResetPassword);
