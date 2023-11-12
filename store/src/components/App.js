import React, {Component} from "react";
import ReactDOM from "react-dom";
import NavBar from "./Navbar";
import Homepage from "./Homepage";

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <NavBar/>
                <div class="container">
                    <br/>
                    <Homepage/>
                </div>
                
            </div>
        );
    }
}

const root = document.getElementById("app")
ReactDOM.render(<App/>, root)