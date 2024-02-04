import React, { Component } from "react";
import ReactSlider from "react-slider";

class FilterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      minPrice: 20,
      maxPrice: 400,
      digital: "all",
      products: this.props.products,
    };

    this.fetchFilteredData = this.fetchFilteredData.bind(this);
  }

  async fetchFilteredData() {
    const { minPrice, maxPrice, digital } = this.state;
    const queryParams = `min_price=${minPrice}&max_price=${maxPrice}&digital=${digital}`;
    try {
      const response = await fetch(`/api/products/filter/?${queryParams}`);
      const data = await response.json();
      this.props.productToggler(data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.minPrice !== this.state.minPrice ||
      prevState.maxPrice !== this.state.maxPrice ||
      prevState.digital !== this.state.digital
    ) {
      this.fetchFilteredData();
    }
  }

  handleSliderChange = (values) => {
    this.setState({ minPrice: values[0], maxPrice: values[1] });
  };

  // handleCheckboxChange = (event) => {
  //   this.setState({ digital: event.target.checked });
  // };

  handleRadioChange = (event) => {
    this.setState({ digital: event.target.value });
  };

  render() {
    const { minPrice, maxPrice, digital } = this.state;
    console.log(digital);
    return (
      <div className="card mb-3">
        <article className="card-group-item">
          <header className="card-header">
            <h6 className="title">Range input </h6>
          </header>
          <div className="filter-content">
            <div className="card-body">
              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                min={20}
                max={400}
                pearling
                minDistance={20}
                defaultValue={[minPrice, maxPrice]}
                onChange={this.handleSliderChange}
              />
              <div>
                Price range: ${minPrice} - ${maxPrice}
              </div>
            </div>
          </div>
        </article>
        <article className="card-group-item">
          <header className="card-header">
            <h6 className="title">Digital Filter</h6>
          </header>
          <div className="filter-content">
            <div className="card-body">
              {/* <label>
                <input
                  type="checkbox"
                  checked={digital}
                  onChange={this.handleCheckboxChange}
                />
                Digital
              </label> */}
              <div className="row">
                <div className="col-12">
                  <label className="d-flex gap-2">
                    <input
                      type="radio"
                      value="all"
                      checked={digital === "all"}
                      onChange={this.handleRadioChange}
                    />
                    All
                  </label>
                </div>
                <div className="col-12">
                  <label className="d-flex gap-2">
                    <input
                      type="radio"
                      value="true"
                      checked={digital === "true"}
                      onChange={this.handleRadioChange}
                    />
                    Digital
                  </label>
                </div>
                <div className="col-12">
                  <label className="d-flex gap-2">
                    <input
                      type="radio"
                      value="false"
                      checked={digital === "false"}
                      onChange={this.handleRadioChange}
                    />
                    Non-Digital
                  </label>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }
}

export default FilterComponent;
