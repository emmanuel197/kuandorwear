import React, { Component } from "react";
class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      products: this.props.products,
    };
    this.Search = this.Search.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async Search() {
    try {
      const response = await fetch(`/api/search/?q=${this.state.query}`);
      const data = await response.json();
      this.props.productToggler(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  render() {
    return (
      // <nav class="navbar justify-content-between pl-0 pr-0">
      // <a class="navbar-brand">Featured Products</a>
      // <div class="form-inline">
      //     <input class="form-control mr-sm-2" type="text" onChange={this.handleChange} name="query" value={this.state.query} placeholder="Search" aria-label="Search"/>
      //     <button class="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={() => {this.Search()}}>Search</button>
      // </div>
      // </nav>
      <nav  className="navbar  px-0 d-flex">
        <a className="navbar-brand">Featured Products</a>
        <div id="search-wrapper" className="d-flex gap-2" >
        
          <input
            className="form-control"
            type="text"
            onChange={this.handleChange}
            name="query"
            value={this.state.query}
            placeholder="Search"
            aria-label="Search"
            id="search-box"
          />
          <button
            id="search-button"
            className="btn btn-outline-success my-2 my-sm-0"
            type="submit"
            onClick={() => {
              this.Search();
            }}
          >
            Search
          </button>
        </div>
      </nav>
    );
  }
}

export default SearchComponent;
