import React, { Component } from "react";
import ReactSlider from "react-slider";
// import "../cssEffects";
class FilterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      minPrice: 18,
      maxPrice: 400,
      digital: "all",
      products: this.props.products,
      activeButton: "apply",
      isCollapsed: {}
    };

    this.fetchFilteredData = this.fetchFilteredData.bind(this);
    this.resetHandler = this.resetHandler.bind(this);
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
  handleButtonClick = (buttonId) => {
    this.setState({ activeButton: buttonId });
  };

  async resetHandler()  {
    this.setState({ minPrice: 18, maxPrice: 400, digital: "all" });
    const queryParams = `min_price=18&max_price=400&digital=all`;
    const response =  await fetch(`/api/products/filter/?${queryParams}`);
    const data = await response.json();
    this.props.productToggler(data);
  }

  // componentDidUpdate(prevProps, prevState) {
    // if (
    //   prevState.minPrice !== this.state.minPrice ||
    //   prevState.maxPrice !== this.state.maxPrice ||
    //   prevState.digital !== this.state.digital
    // ) {
    //   this.fetchFilteredData();
    // }
  //   if (
  //     this.state.minPrice == 18 &&
  //     this.state.maxPrice == 400 && 
  //     this.state.digital == "all"
  //   ) {
  //     this.fetchFilteredData();
  //   }
  // }

  handleSliderChange = (values) => {
    this.setState({ minPrice: values[0], maxPrice: values[1] });
  };

  // handleCheckboxChange = (event) => {
  //   this.setState({ digital: event.target.checked });
  // };

  handleRadioChange = (event) => {
    this.setState({ digital: event.target.value });
  };

  // toggleCollapse = () => {
  //   this.setState(prevState => ({ isCollapsed: !prevState.isCollapsed }));
  // };
  toggleCollapse = (id) => {
    this.setState(prevState => ({
      isCollapsed: {
        ...prevState.isCollapsed,
        [id]: !prevState.isCollapsed[id],
      },
    }));
  };

  renderButton(id) {
    return (
      <button
      id="accordion-btn"
        className="btn ml-auto"
        type="button"
        onClick={() => this.toggleCollapse(id)}
      >
        <span className={`fas ${this.state.isCollapsed[id] ? 'fa-plus' : 'fa-minus'}`}></span>
      </button>
    );
  }

  render() {
    const { minPrice, maxPrice, digital, activeButton } = this.state;

    return (
      <div id="filterbar" class="mt-2 mb-5">
        <div class="box border-bottom">
          <div class="form-group text-center">
            <div class="btn-group" data-toggle="buttons">
              <button
                className={`btn btn-success ${
                  activeButton === "reset" ? "active" : ""
                }`}
                id="reset-btn"
                onClick={() => {
                  this.handleButtonClick("reset")
                  this.resetHandler()
                }}
              >
                Reset
              </button>
              <button
                className={`btn btn-success ${
                  activeButton === "apply" ? "active" : ""
                }`}
                id="apply-btn"
                onClick={() => {
                  this.handleButtonClick("apply")
                  this.fetchFilteredData()
                }}
              >
                Apply
              </button>
              {/* <label class="btn btn-success form-check-label active"> <input class="form-check-input" type="radio" checked/> Apply </label> */}
            </div>
          </div>
          {/* <div>
            <label class="tick">
              New <input type="checkbox" checked="checked" />{" "}
              <span class="check"></span>{" "}
            </label>
          </div>
          <div>
            {" "}
            <label class="tick">
              Sale <input type="checkbox" /> <span class="check"></span>{" "}
            </label>{" "}
          </div> */}
        </div>
        <div class="box border-bottom">
          <div class="box-label text-uppercase d-flex align-items-center justify-content-between">
            Product Type
            {this.renderButton("product type")}
          </div>
         {!this.state.isCollapsed["product type"] && <div id="inner-box" class="mt-2 mr-1">
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
      
            {/* <div class="my-1">
              <label class="tick">
                Windbreaker <input type="checkbox" checked="checked" />{" "}
                <span class="check"></span>{" "}
              </label>
            </div>
            <div class="my-1">
              <label class="tick">
                Jumpsuit <input type="checkbox" /> <span class="check"></span>{" "}
              </label>{" "}
            </div>
            <div class="my-1">
              <label class="tick">
                Jacket <input type="checkbox" /> <span class="check"></span>{" "}
              </label>{" "}
            </div>
            <div class="my-1">
              <label class="tick">
                Coat <input type="checkbox" /> <span class="check"></span>{" "}
              </label>{" "}
            </div>
            <div class="my-1">
              <label class="tick">
                Raincoat <input type="checkbox" /> <span class="check"></span>{" "}
              </label>{" "}
            </div>
            <div class="my-1">
              <label class="tick">
                Handbag <input type="checkbox" checked />{" "}
                <span class="check"></span>{" "}
              </label>
            </div>
            <div class="my-1">
              <label class="tick">
                Warm vest <input type="checkbox" /> <span class="check"></span>{" "}
              </label>
            </div>
            <div class="my-1">
              <label class="tick">
                Wallets <input type="checkbox" checked />{" "}
                <span class="check"></span>{" "}
              </label>
            </div> */}
          </div>}
        </div>
          <div class="box">
            <div class="box-label text-uppercase d-flex align-items-center justify-content-between">
              price
              {this.renderButton("price")}
            </div>
            {!this.state.isCollapsed["price"] && (
               <>
               <ReactSlider
              className="horizontal-slider"
              thumbClassName="example-thumb"
              trackClassName="example-track"
              min={18}
              max={400}
              minDistance={20}
              defaultValue={[minPrice, maxPrice]}
              onChange={this.handleSliderChange}
            />
            <div>
              Price range: ${minPrice} - ${maxPrice}
            </div></>)}
          </div>
        </div>

      // <div id="filterbar" class="collapse">
      //       <div class="box border-bottom">
      //           <div class="form-group text-center">
      //               <div class="btn-group" data-toggle="buttons">
      //                   <label class="btn btn-success form-check-label"> <input class="form-check-input" type="radio"/> Reset </label>
      //                   <label class="btn btn-success form-check-label active"> <input class="form-check-input" type="radio" checked/> Apply </label>
      //               </div>
      //           </div>
      //           <div>
      //               <label class="tick">New <input type="checkbox" checked="checked"/> <span class="check"></span> </label>
      //           </div>
      //           <div> <label class="tick">Sale <input type="checkbox"/> <span class="check"></span> </label> </div>
      //       </div>
      //       <div class="box border-bottom">
      //           <div class="box-label text-uppercase d-flex align-items-center">Outerwear
      //               <button class="btn ml-auto" type="button" data-toggle="collapse" data-target="#inner-box" aria-expanded="false" aria-controls="inner-box" id="out" onclick="outerFilter()"> <span class="fas fa-plus"></span> </button>
      //           </div>
      //           <div id="inner-box" class="collapse mt-2 mr-1">
      //               <div class="my-1">
      //                   <label class="tick">Windbreaker <input type="checkbox" checked="checked"/> <span class="check"></span> </label>
      //               </div>
      //               <div class="my-1">
      //                   <label class="tick">Jumpsuit <input type="checkbox"/> <span class="check"></span> </label> </div>
      //               <div class="my-1">
      //                   <label class="tick">Jacket <input type="checkbox"/> <span class="check"></span> </label> </div>
      //               <div class="my-1">
      //                   <label class="tick">Coat <input type="checkbox"/> <span class="check"></span> </label> </div>
      //               <div class="my-1">
      //                   <label class="tick">Raincoat <input type="checkbox"/> <span class="check"></span> </label> </div>
      //               <div class="my-1">
      //                   <label class="tick">Handbag <input type="checkbox" checked/> <span class="check"></span> </label>
      //               </div>
      //               <div class="my-1">
      //                   <label class="tick">Warm vest <input type="checkbox"/> <span class="check"></span> </label>
      //               </div>
      //               <div class="my-1">
      //                   <label class="tick">Wallets <input type="checkbox" checked/> <span class="check"></span> </label>
      //               </div>
      //           </div>
      //       </div>
      //       <div class="box border-bottom">
      //           <div class="box-label text-uppercase d-flex align-items-center">season
      //               <button class="btn ml-auto" type="button" data-toggle="collapse" data-target="#inner-box2" aria-expanded="false" aria-controls="inner-box2"><span class="fas fa-plus"></span></button>
      //           </div>
      //           <div id="inner-box2" class="collapse mt-2 mr-1">
      //               <div class="my-1">
      //                   <label class="tick">Spring <input type="checkbox" checked="checked"/> <span class="check"></span> </label>
      //               </div>
      //               <div class="my-1">
      //                   <label class="tick">Summer <input type="checkbox"/> <span class="check"></span> </label> </div>
      //               <div class="my-1">
      //                   <label class="tick">Autumn <input type="checkbox" checked/> <span class="check"></span> </label>
      //               </div>
      //               <div class="my-1">
      //                   <label class="tick">Winter <input type="checkbox"/> <span class="check"></span> </label> </div>
      //               <div class="my-1">
      //                   <label class="tick">Rainy <input type="checkbox"/> <span class="check"></span> </label> </div>
      //           </div>
      //       </div>
      //       <div class="box border-bottom">
      //           <div class="box-label text-uppercase d-flex align-items-center">price
      //               <button class="btn ml-auto" type="button" data-toggle="collapse" data-target="#price" aria-expanded="false" aria-controls="price"><span class="fas fa-plus"></span></button>
      //           </div>
      //           <div class="collapse" id="price">
      //               <div class="middle">
      //                   <div class="multi-range-slider"> <input type="range" id="input-left" min="0" max="100" value="10"/>
      //                       <input type="range" id="input-right" min="0" max="100" value="50"/>
      //                       <div class="slider">
      //                           <div class="track"></div>
      //                           <div class="range"></div>
      //                           <div class="thumb left"></div>
      //                           <div class="thumb right"></div>
      //                       </div>
      //                   </div>
      //               </div>
      //               <div class="d-flex align-items-center justify-content-between mt-2">
      //                   <div> <span id="amount-left" class="font-weight-bold"></span> uah </div>
      //                   <div> <span id="amount-right" class="font-weight-bold"></span> uah </div>
      //               </div>
      //           </div>
      //       </div>
      //       <div class="box">
      //           <div class="box-label text-uppercase d-flex align-items-center">size
      //               <button class="btn ml-auto" type="button" data-toggle="collapse" data-target="#size" aria-expanded="false" aria-controls="size"><span class="fas fa-plus"></span></button>
      //           </div>
      //           <div id="size" class="collapse">
      //               <div class="btn-group d-flex align-items-center flex-wrap" data-toggle="buttons">
      //                   <label class="btn btn-success form-check-label"> <input class="form-check-input" type="checkbox"/> 80 </label>
      //                   <label class="btn btn-success form-check-label"> <input class="form-check-input" type="checkbox" checked/> 92 </label>
      //                   <label class="btn btn-success form-check-label"> <input class="form-check-input" type="checkbox" checked/> 102 </label>
      //                   <label class="btn btn-success form-check-label"> <input class="form-check-input" type="checkbox" checked/> 104 </label>
      //                   <label class="btn btn-success form-check-label"> <input class="form-check-input" type="checkbox" checked/> 106 </label>
      //                   <label class="btn btn-success form-check-label"> <input class="form-check-input" type="checkbox" checked/> 108 </label>
      //               </div>
      //           </div>
      //       </div>
      //   </div>
      // <div className="card mb-3">
      //   <article className="card-group-item">
      //     <header className="card-header">
      //       <h6 className="title">Range input </h6>
      //     </header>
      //     <div className="filter-content">
      //       <div className="card-body">
      //         <ReactSlider
      //           className="horizontal-slider"
      //           thumbClassName="example-thumb"
      //           trackClassName="example-track"
      //           min={20}
      //           max={400}
      //           pearling
      //           minDistance={20}
      //           defaultValue={[minPrice, maxPrice]}
      //           onChange={this.handleSliderChange}
      //         />
      //         <div>
      //           Price range: ${minPrice} - ${maxPrice}
      //         </div>
      //       </div>
      //     </div>
      //   </article>
      //   <article className="card-group-item">
      //     <header className="card-header">
      //       <h6 className="title">Digital Filter</h6>
      //     </header>
      //     <div className="filter-content">
      //       <div className="card-body">
      //         {/* <label>
      //           <input
      //             type="checkbox"
      //             checked={digital}
      //             onChange={this.handleCheckboxChange}
      //           />
      //           Digital
      //         </label> */}
      //         <div className="row">
      //           <div className="col-12">
      //             <label className="d-flex gap-2">
      //               <input
      //                 type="radio"
      //                 value="all"
      //                 checked={digital === "all"}
      //                 onChange={this.handleRadioChange}
      //               />
      //               All
      //             </label>
      //           </div>
      //           <div className="col-12">
      //             <label className="d-flex gap-2">
      //               <input
      //                 type="radio"
      //                 value="true"
      //                 checked={digital === "true"}
      //                 onChange={this.handleRadioChange}
      //               />
      //               Digital
      //             </label>
      //           </div>
      //           <div className="col-12">
      //             <label className="d-flex gap-2">
      //               <input
      //                 type="radio"
      //                 value="false"
      //                 checked={digital === "false"}
      //                 onChange={this.handleRadioChange}
      //               />
      //               Non-Digital
      //             </label>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </article>

      // </div>
    );
  }
}

export default FilterComponent;
