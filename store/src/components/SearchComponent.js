import React, { Component } from "react";
class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: this.props.query,
      products: this.props.products,
      

    };
    this.Search = this.Search.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  async Search() {
    this.props.searchClickedToggler()
    try {
      const response = await fetch(`/api/search/?q=${this.state.query}`);
      const data = await response.json();
      // this.setState({ filteredProducts: data })
      // this.props.productToggler(this.state.query);
      this.props.productToggler(data, this.state.query);
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
      <>
        <nav  className="navbar  px-0 d-flex">
          <h2 id="featured-products-header">Featured Products</h2>
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
              className="btn my-2 my-sm-0"
              type="submit"
              onClick={() => {
                this.Search();
              }}
            >
              Search
            </button>
          </div>
        </nav>

        

      </>
      );
  }
}

export default SearchComponent;
