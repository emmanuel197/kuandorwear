import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { facebookAuthenticate } from '../actions/auth';
import queryString from 'query-string';

// const Facebook = ({ facebookAuthenticate }) => {
//     let location = useLocation();

//     useEffect(() => {
//         const values = queryString.parse(location.search);
//         const state = values.state ? values.state : null;
//         const code = values.code ? values.code : null;

//         console.log('State: ' + state);
//         console.log('Code: ' + code);

//         if (state && code) {
//             facebookAuthenticate(state, code);
//         }
//     }, [location]);

//     return (
//         <div className='container'>
//             <div class='jumbotron mt-5'>
//                 <h1 class='display-4'>Welcome to Auth System!</h1>
//                 <p class='lead'>This is an incredible authentication system with production level features!</p>
//                 <hr class='my-4' />
//                 <p>Click the Log In button</p>
//                 <Link class='btn btn-primary btn-lg' to='/login' role='button'>Login</Link>
//             </div>
//         </div>
//     );
// };
class Facebook extends Component {
    constructor(props) {
        super(props);
        
        this.fetchData = this.fetchData.bind(this)
    }
    
    fetchData() {
        const { facebookAuthenticate } = this.props;
        const values = queryString.parse(this.props.location.search);
        const state = values.state ? values.state : null;
        const code = values.code ? values.code : null;

        console.log('State: ' + state);
        console.log('Code: ' + code);

        if (state && code) {
            facebookAuthenticate(state, code);
        }
    }
    componentDidMount() {
        this.fetchData()
    }
        componentDidUpdate(prevProps) {
            if (prevProps.location !== this.props.location) {
                this.fetchData()
            }
        }
    render() {
        return (
            <div className='container'>
                <div class='jumbotron mt-5'>
                    <h1 class='display-4'>Welcome to Auth System!</h1>
                    <p class='lead'>This is an incredible authentication system with production level features!</p>
                    <hr class='my-4' />
                    <p>Click the Log In button</p>
                    <Link class='btn btn-primary btn-lg' to='/login' role='button'>Login</Link>
                </div>
            </div>
        );
    }
}

export default withRouter(connect(null, { facebookAuthenticate })(Facebook));
