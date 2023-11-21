import React, {Component} from "react";
import ReactDOM from "react-dom";
import NavBar from "./Navbar";
import Homepage from "./Homepage";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logged_in: false
        }
        this.logToggler = this.logToggler.bind(this)
    }

    logToggler() {
        this.setState(prevState => ({
            logged_in: !prevState.logged_in
        }));
    }

   
    render() {
        return (
            <div>
                <NavBar logged_in={this.state.logged_in}/>
                <div class="container">
                    <br/>
                    <Homepage logged_in={this.state.logged_in} logToggler={this.logToggler}/>
                </div>
                
            </div>
        );
    }
}

const root = document.getElementById("app")
ReactDOM.render(<App/>, root)